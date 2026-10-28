import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Bx, Cam, Glow, Shot, Sp, type V3 } from "./kit/three";
import { BlurIn, DUR, FPS, FadeOut, Flash, Grain, LINE, Vig, fr, io } from "./kit/ui";
import { Char, headCenter, type Look, type Pose } from "./rig/char";
import { ADULT, FRIEND, FON, KHUN, NAT, NAT_Z, SCRUBS, ZOMBIE_A, ZOMBIE_B, ZOMBIE_C } from "./rig/cast";
import { CROUCH, runPose, shamblePose, walkPose } from "./rig/poses";
import { Cat, KHAOPAN } from "./rig/pets";
import { Apartment, DOOR } from "./sets/apartment";
import { C_PHONE, Corridor } from "./sets/condo";
import { ST_DOWN, ST_LANDING, ST_TOP_STEP, ST_WELL_CAM, ST_WELL_LOOK, Stairwell } from "./sets/stairwell";
import { SR_INSIDE, SR_KERB, SR_SEDAN, SR_WALL, Street } from "./sets/street";
import { CAR_YOU, HW_CAM, HW_DRIVER, HW_HONKER, HW_LOOK, HW_RAIL, Highway } from "./sets/highway";
import { MK_AISLE, MK_AISLE_END, MK_BACKDOOR, MK_GLASSDOOR, Market } from "./sets/market";
import { RS_CAT, RS_DITCH, RS_FAR, RS_SIGN, Roadside } from "./sets/roadside";
import { CP_GATE, CP_GUARD, CP_INSIDE, CP_OUTSIDE, CP_QUEUE, CP_TABLE, CP_TOWER, Camp, HILL_CAM, HILL_TARGET } from "./sets/camp";
import { Captions } from "./ui/captions";
import { NextCard, ProofCard, Rings, RuleTag } from "./ui/cards";
import { DayCard, DayHUD, TitleCard } from "./ui/days";

/** EP2 "วิธีเอาตัวรอดซอมบี้บุกโลกใน 30 วัน" — days 31–60, one clip.
 *  Same build as EP1: SHOTS per script line (1 or 2), CUTS built from them, day chip / day card / rule tag per line. */

/* ─── helpers ─── */
const blink = (f: number, s = 0) => ((f + s * 23) % 83 < 4 ? 1 : 0);
const face = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const FACE = headCenter(KHUN);
/** camera that pushes slowly toward its target */
const Push: React.FC<{ p: V3; t: V3; fov?: number; k?: number; drift?: number }> = ({ p, t, fov = 40, k = 0.004, drift = 0.4 }) => {
  const f = useCurrentFrame();
  const d: V3 = [t[0] - p[0], t[1] - p[1], t[2] - p[2]];
  const L = Math.hypot(...d) || 1;
  const m = Math.min(f * k, L * 0.35);
  return <Cam p={[p[0] + (d[0] / L) * m, p[1] + (d[1] / L) * m, p[2] + (d[2] / L) * m]} t={t} fov={fov} drift={drift} />;
};
/** camera in front of someone at `at` facing `ry`, distance d, at face height y, optional side offset */
const front = (at: V3, ry: number, d: number, y = FACE, side = 0.2): { p: V3; t: V3 } => ({
  p: [at[0] + Math.sin(ry) * d + Math.cos(ry) * side, at[1] + y + 0.04, at[2] + Math.cos(ry) * d - Math.sin(ry) * side],
  t: [at[0], at[1] + y - 0.12, at[2]],
});

/** backpack with the cat's head poking out (mounted on the back via Char's `back`) */
const Pack: React.FC<{ puff?: number }> = ({ puff = 0 }) => {
  const f = useCurrentFrame();
  return (
    <group>
      <Bx p={[0, -0.18, -0.05]} s={[0.3, 0.42, 0.18]} c="#3A4A5E" />
      <Cat p={[0, -0.1, -0.06]} ry={Math.PI} s={0.62} colors={KHAOPAN} bell={false} pose={{ crouch: 1, puff, head: [0, puff * 0.25], tail: f / 10, blink: blink(f, 3) }} />
    </group>
  );
};
const K: React.FC<{ at: V3; ry?: number; look?: V3; pose?: Pose; pack?: boolean; puff?: number; L?: Look }> = ({ at, ry, look, pose, pack, puff, L = KHUN }) => {
  const f = useCurrentFrame();
  return <Char L={L} p={at} ry={ry ?? (look ? face(at, look) : 0)} pose={{ browUp: 0.5, blink: blink(f), ...pose }} seed={1} back={pack ? <Pack puff={puff} /> : undefined} />;
};
const Fon: React.FC<{ at: V3; ry?: number; look?: V3; pose?: Pose; hood?: boolean; L?: Look }> = ({ at, ry, look, pose, hood, L = FON }) => {
  const f = useCurrentFrame();
  return <Char L={{ ...L, hoodUp: hood }} p={at} ry={ry ?? (look ? face(at, look) : 0)} pose={{ browUp: 0.5, blink: blink(f, 5), ...pose }} seed={5} />;
};
const Z: React.FC<{ L: Look; at: V3; ry?: number; ph?: number; speed?: number; seed?: number }> = ({ L, at, ry = 0, ph = 0, speed = 0.006, seed = 7 }) => {
  const f = useCurrentFrame();
  const p: V3 = [at[0] + Math.sin(ry) * f * speed, at[1], at[2] + Math.cos(ry) * f * speed];
  return <Char L={L} p={p} ry={ry} pose={shamblePose(f / 6 + ph)} seed={seed} />;
};
/** walking along a direction, feet locked to distance */
const walkAt = (at: V3, ry: number, f: number, speed = 0.018): { p: V3; pose: Pose } => {
  const dist = f * speed;
  return { p: [at[0] + Math.sin(ry) * dist, at[1], at[2] + Math.cos(ry) * dist], pose: walkPose((dist / 1.2) * Math.PI * 2, 0.9) };
};
const runAt = (at: V3, ry: number, f: number, speed = 0.06, ph0 = 0): { p: V3; pose: Pose } => {
  const dist = f * speed;
  return { p: [at[0] + Math.sin(ry) * dist, at[1], at[2] + Math.cos(ry) * dist], pose: runPose(dist, ph0) };
};
const SCARED: Pose = { browUp: 1, mouth: 0.25, blink: 0 };
const GUARD: Look = { ...NAT, top: "#4A5A3A", pants: "#3A4430", radio: undefined, keys: false };
const FON_RADIO: Look = { ...FON, holdR: "phone" };

/* ─── apartment (day 30/31 night, blackout) ─── */
const K_DOOR: V3 = [1.2, 0, -2.3];
const K_MID: V3 = [0.4, 0, 0.1];
const Room: React.FC<{ door?: number; chain?: boolean; knob?: number; children?: React.ReactNode }> = ({ door = 0, chain = false, knob = 0, children }) => (
  <Apartment night={1} power={0} lamp={0.35} tally={30} food={0.15} doorOpen={door} chain={chain} knob={knob} backpack="#3A4A5E">
    <pointLight position={[0.2, 1.8, -1.2]} intensity={0.8} distance={4} color="#9FB0E0" />
    {children}
  </Apartment>
);
const SKnob: React.FC<{ turn?: boolean }> = ({ turn }) => { const f = useCurrentFrame(); return <Shot><Room knob={turn ? io(f, 6, 30, 0, 1) : 1} /><pointLight position={[DOOR[0] + 0.6, 1.2, -2.2]} intensity={0.9} distance={2} color="#9FB0E0" /><Cam p={[DOOR[0] + 0.85, 1.25, -1.6 - f * 0.002]} t={[DOOR[0] + 0.2, 1.0, -3]} fov={34} drift={0.3} /></Shot>; };
const SRoomWide: React.FC = () => { const f = useCurrentFrame(); return <Shot><Room><K at={K_MID} look={DOOR} pose={SCARED} pack puff={1} /></Room><Cam p={[-2.2, 1.75, 2.5 - f * 0.003]} t={[0.8, 0.8, -1.8]} fov={50} drift={0.5} /></Shot>; };
const SDoorIn: React.FC<{ chain?: boolean; push?: boolean; hand?: boolean }> = ({ chain, push, hand }) => {
  const f = useCurrentFrame();
  const pose: Pose = push ? { ...SCARED, shL: [-1.5, 0, 0.3], shR: [-1.5, 0, -0.3], elL: -0.4, elR: -0.4, spine: [0.2, 0, 0] } : SCARED;
  return <Shot><Room door={chain ? 0.1 : io(f, 0, 12, 0, 0.1)} chain={chain}>
    <K at={push ? [1.05, 0, -2.6] : K_DOOR} ry={Math.PI} pose={pose} pack={!hand} />
    {hand ? <Char L={NAT_Z} p={[1.6, 0, -3.35]} ry={-0.3} pose={{ shL: [-1.5, 0.5, 0.2], elL: -0.1, mouth: 0.4 }} seed={4} /> : null}
  </Room><Cam p={[0.1, 1.45, -0.4 - f * 0.004]} t={[DOOR[0], 1.05, DOOR[2]]} fov={hand ? 36 : 42} drift={0.5} /></Shot>;
};
const SPhoneFace: React.FC = () => { const at: V3 = [0.9, 0, -1.6]; const ry = face(at, DOOR); const c = front(at, ry, 1.5); return <Shot><Room door={0.1} chain><K at={at} ry={ry} L={{ ...KHUN, holdR: "phone" }} pose={{ shR: [-1.15, 0.2, -0.25], elR: -1.5, head: [0.35, 0, 0], browUp: 0.8 }} pack /><pointLight position={[at[0] + 0.15, FACE - 0.2, at[2] - 0.35]} intensity={0.5} distance={1} color="#BFD4FF" /></Room><Push p={c.p} t={c.t} fov={32} /></Shot>; };
/** the scratch: close on the back of the left hand (watch + red mark) */
const SScratch: React.FC<{ dim?: number; light?: boolean }> = ({ dim = 1, light }) => {
  const f = useCurrentFrame();
  const paw = light ? 0 : io(f, 0, 14, 0, 1);
  const marks = light ? 1 : io(f, 10, 18, 0, 1);
  const skin = KHUN.skin;
  return <Shot dim={dim}>
    <color attach="background" args={["#0A0B10"]} />
    <ambientLight intensity={0.5} color="#E8E0D0" />
    <pointLight position={[0.2, 0.6, 0.7]} intensity={light ? 4 : 1.8} distance={3} color={light ? "#FFF6DC" : "#C8D4F0"} />
    {light ? <Glow p={[0.05, 0.5, 0.4]} s={0.9} c="#FFF2D0" o={0.35} /> : null}
    <group rotation={[0.25, 0.35, -0.15]}>
      {/* hoodie sleeve + gold cuff */}
      <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.075, 0.4, 8, 16]} /><meshStandardMaterial color={KHUN.top} roughness={0.9} /></mesh>
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.078, 0.078, 0.05, 20]} /><meshStandardMaterial color="#B48834" roughness={0.8} /></mesh>
      {/* wrist + red watch */}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.055, 0.12, 20]} /><meshStandardMaterial color={skin} roughness={0.8} /></mesh>
      <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.057, 0.057, 0.03, 20]} /><meshStandardMaterial color={KHUN.watchL} roughness={0.6} /></mesh>
      <Bx p={[-0.1, 0.058, 0]} s={[0.045, 0.012, 0.045]} c="#E8E4DA" />
      {/* back of the hand + fingers */}
      <mesh position={[0.02, 0, 0]} scale={[1.25, 0.45, 1]}><sphereGeometry args={[0.07, 24, 16]} /><meshStandardMaterial color={skin} roughness={0.8} /></mesh>
      {[-0.036, -0.012, 0.012, 0.036].map((z, i) => <mesh key={i} position={[0.12, -0.008, z]} rotation={[0, 0, Math.PI / 2 + 0.25]}><capsuleGeometry args={[0.013, 0.06, 6, 10]} /><meshStandardMaterial color={skin} roughness={0.8} /></mesh>)}
      {/* the scratch: three red lines across the back of the hand */}
      {[-0.025, 0, 0.025].map((z, i) => <Bx key={i} p={[0.015, 0.033, z]} s={[0.1 * marks, 0.004, 0.005]} c="#B0202A" ry={0.5} />)}
    </group>
    {/* the cat's paw swiping in */}
    {paw > 0 ? <group position={[0.35 - paw * 0.25, 0.12, 0.05]}><Sp r={0.045} c="#F4F1EA" sc={[1.3, 0.8, 1]} />{[-0.02, 0, 0.02].map((z) => <Sp key={z} p={[-0.05, -0.01, z]} r={0.01} c="#E8A0A0" />)}</group> : null}
    <Push p={[0.0, 0.6, 0.85]} t={[-0.08, -0.1, 0]} fov={32} k={0.001} drift={0.2} />
  </Shot>;
};

/* ─── corridor ─── */
const SCorrPhone: React.FC = () => <Shot><Corridor power={0} phone={1} bell><Z L={NAT_Z} at={[0.3, 0, -5.5]} ry={Math.PI} speed={0.004} seed={4} /></Corridor><Push p={[C_PHONE[0] + 0.3, 0.25, C_PHONE[2] + 1.2]} t={[C_PHONE[0], 0.02, C_PHONE[2]]} fov={42} /></Shot>;
const SCorrNat: React.FC = () => <Shot><Corridor power={0} phone={1} bell><Z L={NAT_Z} at={[0.4, 0, -3.6]} ry={Math.PI} speed={0.008} seed={4} /></Corridor><Push p={[0.9, 1.3, -1.2]} t={[0.2, 1.0, -6]} fov={40} /></Shot>;
const SCorrSneak: React.FC = () => { const f = useCurrentFrame(); const w = walkAt([1.0, 0, -3.4], Math.PI + 0.12, f, 0.014); return <Shot><Corridor power={0} phone={1} stairDoor={0.6} myDoor={0.5}><Char L={KHUN} p={w.p} ry={Math.PI + 0.12} pose={{ ...w.pose, browUp: 0.9 }} seed={1} back={<Pack />} /><Z L={NAT_Z} at={[0.4, 0, -9.0]} ry={Math.PI} speed={0} seed={4} /></Corridor><Push p={[0.6, 1.6, -0.6]} t={[0, 1.0, -7]} fov={44} /></Shot>; };

/* ─── stairwell ─── */
const SWell: React.FC<{ flash?: boolean; top?: number; z?: boolean }> = ({ flash, top = 14, z }) => {
  const f = useCurrentFrame();
  return <Shot><Stairwell power={0.12} exitGlow={1} top={top} floors={4}>
    {flash ? <pointLight position={[0, -1, -1.1]} intensity={6 * io(f, 4, 40, 1, 0)} distance={14} color="#FFF4D8" /> : null}
    {flash ? <Glow p={[0, -0.5, -1.1]} s={1.4} o={io(f, 4, 40, 0.9, 0)} /> : null}
    {z ? <Z L={ZOMBIE_A} at={add(ST_DOWN, [0, -3, -0.6])} ry={Math.PI} speed={0.003} /> : null}
  </Stairwell><Push p={ST_WELL_CAM} t={ST_WELL_LOOK} fov={50} k={0.003} /></Shot>;
};
const SStairFace: React.FC = () => { const at = ST_LANDING; const ry = face(at, ST_TOP_STEP); const c = front(at, ry, 1.5); return <Shot><Stairwell power={0.15} exitGlow={1}><pointLight position={[at[0] + 0.5, 2.2, at[2] - 0.3]} intensity={0.9} distance={3} color="#7CFF9C" /><K at={at} ry={ry} L={{ ...KHUN, holdR: "flashlight" }} pose={{ shR: [-0.9, 0, -0.3], elR: -1.3, browUp: 0.9 }} pack /></Stairwell><Push p={c.p} t={c.t} fov={34} /></Shot>; };
const SStairDown: React.FC<{ top?: number; catClose?: boolean }> = ({ top = 14, catClose }) => {
  const f = useCurrentFrame();
  const at: V3 = [ST_TOP_STEP[0] + 0.2, -0.5 - f * 0.004, ST_TOP_STEP[2] - 0.6 - f * 0.006];
  const ry = Math.PI;
  return <Shot><Stairwell power={0.15} exitGlow={1} top={top} floors={3}>
    <pointLight position={[at[0], at[1] + 2.2, at[2] + 0.6]} intensity={0.9} distance={3} color="#7CFF9C" />
    <Char L={KHUN} p={at} ry={ry} pose={{ ...walkPose(f / 7, 0.6), shL: [-0.6, 0, 0.5], elL: -0.6, browUp: 0.8 }} seed={1} back={<Pack puff={catClose ? 1 : 0} />} />
  </Stairwell>
    {catClose ? <Cam p={[at[0] + 0.15, at[1] + FACE + 0.35, at[2] + 0.75]} t={[at[0], at[1] + FACE - 0.1, at[2] + 0.15]} fov={34} drift={0.3} />
      : <Cam p={[at[0] - 1.2, at[1] + 1.9, at[2] + 1.4]} t={[at[0], at[1] + 0.9, at[2]]} fov={42} drift={0.4} />}
  </Shot>;
};

/* ─── street ─── */
const SLobby: React.FC = () => { const f = useCurrentFrame(); const w = walkAt(SR_INSIDE, Math.PI, f, 0.014); return <Shot><Street day={0.35} broken open={1} smoke={0.4}><Char L={KHUN} p={w.p} ry={Math.PI} pose={w.pose} seed={1} back={<Pack />} /></Street><Push p={[1.6, 1.6, 3.6]} t={[0, 1.0, -2]} fov={44} /></Shot>; };
const SStreetOut: React.FC = () => { const at = SR_KERB; const ry = face(at, [0, 0, 3]); const c = front(at, ry, 2.2, FACE, 0.5); return <Shot><Street day={1} broken open={1} smoke={0.5}><K at={at} ry={ry - 0.5} pose={{ head: [0, 0.5, 0], browUp: 0.7 }} pack /></Street><Push p={c.p} t={c.t} fov={38} /></Shot>; };
const SStreetHigh: React.FC = () => { const f = useCurrentFrame(); const w = walkAt([SR_WALL[0] - 2, SR_WALL[1], SR_WALL[2]], Math.PI / 2, f, 0.016); return <Shot><Street day={1} broken open={1} smoke={0.5}><Char L={KHUN} p={w.p} ry={Math.PI / 2} pose={w.pose} seed={1} back={<Pack />} /></Street><Push p={[SR_WALL[0] + 3.5, 1.7, -5.5]} t={[SR_WALL[0], 1.0, -0.5]} fov={42} /></Shot>; };
const SSedan: React.FC = () => <Shot><Street day={1} sedanDoor={0.7}><K at={add(SR_SEDAN, [-0.6, 0.15, 1.35])} look={SR_SEDAN} pack /></Street><Push p={add(SR_SEDAN, [-3.2, 1.7, 3.0])} t={add(SR_SEDAN, [0, 0.8, 0])} fov={40} /></Shot>;

/* ─── highway ─── */
const SHwWide: React.FC = () => <Shot><Highway day={0.6} headlights={0.2} brake={0.5} /><Push p={[-12, 8, 14]} t={[0, 0, -20]} fov={44} k={0.004} /></Shot>;
const SHwInside: React.FC = () => <Shot><Highway day={0.6} headlights={0.2} door={1}><K at={HW_DRIVER} look={HW_HONKER} pose={{ shR: [-0.6, 0.3, -0.3], elR: -0.4, browUp: 0.9 }} pack /></Highway><Push p={HW_CAM} t={HW_LOOK} fov={40} /></Shot>;
const SHwHonker: React.FC = () => <Shot><Highway day={0.6} headlights={0.2} brake={1} /><Push p={add(CAR_YOU, [0.9, 2.0, 0.5])} t={add(HW_HONKER, [0, 0.6, 0])} fov={38} /></Shot>;
const SHwHigh: React.FC = () => <Shot><Highway day={0.6} headlights={0.2} brake={1} /><Push p={[6, 14, 6]} t={[-1.75, 0, -6]} fov={46} k={0.003} /></Shot>;
const SHwHorde: React.FC = () => <Shot><Highway day={0.55} headlights={0.2} brake={1}>
  <Z L={ZOMBIE_A} at={[-3.5, 0, -14]} ry={0} /><Z L={ZOMBIE_B} at={[0, 0, -18]} ry={0.1} ph={2} /><Z L={ZOMBIE_C} at={[3.5, 0, -15]} ry={-0.1} ph={4} />
  <Z L={ZOMBIE_A} at={[-6.8, 0, -22]} ry={0.2} ph={1} /><Z L={ZOMBIE_C} at={[1.8, 0, -24]} ry={0} ph={3} />
</Highway><Push p={[-1.2, 1.5, -6]} t={[0, 1.0, -18]} fov={40} /></Shot>;
const SHwExit: React.FC = () => { const f = useCurrentFrame(); const ry = face(HW_DRIVER, HW_RAIL); const w = walkAt(HW_DRIVER, ry, f, 0.02); return <Shot><Highway day={0.55} headlights={0.2} door={io(f, 0, 20, 1, 0)}><Char L={KHUN} p={w.p} ry={ry} pose={w.pose} seed={1} back={<Pack />} /></Highway><Push p={[-2.2, 1.6, 3.4]} t={[-5.5, 0.8, -1.5]} fov={44} /></Shot>; };

/* ─── market ─── */
const SMkDoor: React.FC = () => <Shot><Market power={0.5} flicker={0.6} glassDoor={0.5} /><Push p={add(MK_GLASSDOOR, [0.8, 1.6, 3.5])} t={add(MK_GLASSDOOR, [-1.5, 1.0, -4])} fov={42} /></Shot>;
const SMkAisle: React.FC = () => { const at = MK_AISLE; const ry = Math.PI; return <Shot><Market power={0.6} flicker={0.4}><K at={at} ry={ry} pose={{ head: [0, 0.3, 0], browUp: 0.8 }} pack /></Market><Push p={[0.9, 1.7, 0.4]} t={[0, 1.0, -6]} fov={42} /></Shot>; };
const SMkHigh: React.FC = () => <Shot><Market power={0.6} flicker={0.4}><Z L={ZOMBIE_B} at={add(MK_AISLE_END, [0.3, 0, 0])} speed={0} /><Z L={ZOMBIE_C} at={add(MK_AISLE_END, [-0.5, 0, 0.6])} speed={0} ph={3} /><K at={MK_AISLE} ry={Math.PI} pack /></Market><Push p={[1.4, 3.3, 1.5]} t={[0, 0.5, -8]} fov={46} /></Shot>;
const FON_AT: V3 = [-0.75, 0, -5.2];
const SMkFon: React.FC = () => { const ry = face(FON_AT, MK_AISLE); const c = front(FON_AT, ry, 1.6, headCenter(FON)); return <Shot><Market power={0.6} flicker={0.3}><Fon at={FON_AT} ry={ry} pose={{ browUp: 0.9, look: [0.3, 0] }} /></Market><Push p={c.p} t={c.t} fov={34} /></Shot>; };
const SMkCatFon: React.FC = () => { const f = useCurrentFrame(); const ry = face([0, 0, -3.4], FON_AT); const d = Math.min(f * 0.012, 1.4); const cp: V3 = [Math.sin(ry) * d, 0, -3.4 + Math.cos(ry) * d]; return <Shot><Market power={0.6}><Fon at={FON_AT} look={cp} pose={{ head: [0.4, 0, 0], browUp: 0.6 }} /><Cat p={cp} ry={ry} colors={KHAOPAN} bell={false} pose={{ walk: f / 3, amp: d < 1.4 ? 1 : 0, tail: f / 6 }} /></Market><Push p={[0.9, 0.6, -2.4]} t={[-0.5, 0.35, -4.6]} fov={40} /></Shot>; };
const SMkRun: React.FC = () => { const f = useCurrentFrame(); const ry = face([-1.6, 0, -6], MK_BACKDOOR); const a = runAt([-1.0, 0, -6.2], ry, f, 0.05); const b = runAt([-1.5, 0, -5.4], ry, f, 0.05, 1.5); return <Shot><Market power={0.6} flicker={0.8} backDoor={io(f, 10, 30, 0, 1)} water={1}>
  <Char L={KHUN} p={a.p} ry={ry} pose={a.pose} seed={1} back={<Pack puff={1} />} /><Char L={FON} p={b.p} ry={ry} pose={b.pose} seed={5} />
  <Z L={ZOMBIE_B} at={add(MK_AISLE_END, [0.3, 0, 0])} ry={-2.4} speed={0.01} /><Z L={ZOMBIE_C} at={add(MK_AISLE_END, [-0.5, 0, 0.6])} ry={-2.2} speed={0.01} ph={3} />
</Market><Push p={[1.6, 2.4, -3]} t={[-3, 0.8, -11]} fov={46} /></Shot>; };

/* ─── roadside ─── */
const RS_K: V3 = add(RS_DITCH, [0.1, 0, 0]);
const RS_F: V3 = add(RS_DITCH, [-0.5, 0, -0.05]);
const SRsRainWide: React.FC = () => <Shot><Roadside rain={1} moon={1} blanket={false}><FillR /></Roadside><Push p={[5, 2.6, 7]} t={[0, 0.6, -2]} fov={44} /></Shot>;
const SRsWalk: React.FC<{ sign?: boolean; rain?: number }> = ({ sign, rain = 1 }) => { const f = useCurrentFrame(); const a = walkAt([-3, 0.6, 2.2], Math.PI / 2, f, 0.014); const b = walkAt([-3.6, 0.6, 2.6], Math.PI / 2, f, 0.014); return <Shot><Roadside rain={rain} moon={1} blanket={false}><Char L={KHUN} p={a.p} ry={Math.PI / 2} pose={{ ...a.pose, shL: [-0.5, 0, 0.3], elL: -1.2 }} seed={1} back={<Pack />} /><Char L={{ ...FON, hoodUp: rain > 0 }} p={b.p} ry={Math.PI / 2} pose={walkPose(f / 6 + 1, 0.9)} seed={5} /><FillR /></Roadside>{sign ? <Push p={[RS_SIGN[0] + 1.5, 2.2, 7.5]} t={[RS_SIGN[0] - 2.5, 1.0, 2.2]} fov={44} /> : <Push p={[0.5, 1.7, 5.8]} t={[-2.4, 1.2, 2.3]} fov={40} />}</Shot>; };
const SRsFeet: React.FC = () => { const f = useCurrentFrame(); const a = walkAt([-2, 0.6, 2.2], Math.PI / 2, f, 0.014); return <Shot><Roadside rain={1} moon={1} blanket={false}><Char L={KHUN} p={a.p} ry={Math.PI / 2} pose={a.pose} seed={1} /><FillR /></Roadside><Cam p={[a.p[0] + 0.9, 0.85, 3.2]} t={[a.p[0], 0.7, 2.2]} fov={36} drift={0.3} /></Shot>; };
const SRsRadio: React.FC<{ close?: boolean }> = ({ close }) => { const at: V3 = [-0.6, 0.6, 1.9]; const ry = face(at, [2, 0.6, 4]); const c = front(at, ry, close ? 1.1 : 1.7, headCenter(FON), 0.15); return <Shot><Roadside moon={1} blanket={false}><Fon at={at} ry={ry} L={FON_RADIO} pose={{ shR: [-2.1, 0.3, -0.4], elR: -1.6, head: [0, -0.35, 0.15], browUp: -0.3 }} /><K at={add(at, [0.8, 0, 0.3])} look={at} pack /><FillR /></Roadside><Push p={c.p} t={c.t} fov={close ? 30 : 36} /></Shot>; };
const SRsFaces: React.FC = () => { const a: V3 = [-0.6, 0.6, 1.9]; const b: V3 = [0.2, 0.6, 2.2]; return <Shot><Roadside moon={1} blanket={false}><Fon at={a} look={b} pose={{ browUp: -0.2 }} /><K at={b} look={a} pose={{ browUp: 0.7 }} pack /><FillR /></Roadside><Push p={[-0.1, 0.6 + FACE + 0.1, 4.0]} t={[-0.2, 0.6 + FACE - 0.1, 2.0]} fov={34} /></Shot>; };
const SRsLeave: React.FC = () => { const f = useCurrentFrame(); const a = walkAt([0.4, 0, -1.5], Math.PI, f, 0.014); const b = walkAt([-0.4, 0, -1.3], Math.PI, f, 0.014); return <Shot><Roadside moon={1} blanket={false}><Char L={KHUN} p={a.p} ry={Math.PI} pose={a.pose} seed={1} back={<Pack />} /><Char L={FON} p={b.p} ry={Math.PI} pose={walkPose(f / 6 + 1, 0.9)} seed={5} /><FillR /></Roadside><Push p={[1.2, 2.4, 4.5]} t={[0, 0.8, -6]} fov={42} /></Shot>; };
const SRsNight: React.FC<{ hands?: boolean; blanket?: boolean }> = ({ hands, blanket }) => {
  const f = useCurrentFrame();
  const shiver = Math.sin(f * 1.3) * 0.02;
  return <Shot><Roadside moon={0.6} blanket={!!blanket}>
    <Char L={KHUN} p={RS_K} ry={2.6} pose={{ ...CROUCH, spine: [0.45 + shiver, 0, 0], ...(hands ? { shR: [-1.4, 0.6, -0.4], elR: -0.6 } : {}), browUp: 0.8 }} seed={1} />
    <Char L={{ ...FON, hoodUp: true, holdR: hands ? "flashlight" : undefined }} p={RS_F} ry={2.6} pose={{ ...CROUCH, spine: [0.45 - shiver, 0, 0], ...(hands ? { shR: [-1.5, 0, -0.2], elR: -0.9 } : {}), browUp: 0.7 }} seed={5} />
    {blanket ? <Cat p={add(RS_DITCH, [-0.2, 0, 0.35])} ry={2.6} s={0.9} colors={KHAOPAN} bell={false} pose={{ crouch: 1, blink: blink(f, 3) }} /> : <Cat p={RS_CAT} ry={2.6} colors={KHAOPAN} bell={false} pose={{ crouch: 0.8, tail: f / 12 }} />}
  <FillR /></Roadside><Push p={hands ? [0.4, 1.2, 1.8] : [1.6, 1.4, 2.6]} t={hands ? [-0.2, 0.55, -0.1] : [-0.2, 0.45, -0.2]} fov={hands ? 34 : 40} /></Shot>;
};
const SRsFar: React.FC = () => <Shot><Roadside moon={0.5} farLight={1} blanket={false}><Z L={ZOMBIE_A} at={add(RS_FAR, [-6, -1.4, 10])} ry={1.0} speed={0.01} /><Z L={ZOMBIE_C} at={add(RS_FAR, [-9, -1.4, 14])} ry={0.9} speed={0.01} ph={3} /><FillR /></Roadside><Push p={[-2, 2.5, 3]} t={RS_FAR} fov={30} k={0.003} /></Shot>;

/* fill lights so faces read in the night exteriors */
const FillR: React.FC = () => <><ambientLight intensity={0.55} color="#B8C8E0" /><pointLight position={[1.5, 3, 4]} intensity={1.6} distance={12} color="#C8D8F0" /></>;
const FillC: React.FC = () => <><ambientLight intensity={0.5} color="#C8D0E8" /><pointLight position={[2, 4, 4]} intensity={2.0} distance={16} color="#E8EEFF" /></>;

/* ─── camp ─── */
const SCampHill: React.FC<{ day?: number }> = ({ day = 0 }) => <Shot><Camp lights={1} day={day}><FillC /></Camp><Push p={HILL_CAM} t={HILL_TARGET} fov={36} k={0.006} /></Shot>;
const SCampHide: React.FC = () => { const kA: V3 = add(HILL_CAM, [1.0, -9, -3]); return <Shot><Camp lights={1}><group position={[0, 0, 0]}><Bx p={add(kA, [0, -0.2, 0])} s={[4, 0.4, 3]} c="#2A3220" /></group><Char L={KHUN} p={kA} ry={face(kA, HILL_TARGET)} pose={{ ...CROUCH, browUp: 0.8 }} seed={1} back={<Pack />} /><Char L={{ ...FON, hoodUp: true }} p={add(kA, [-0.7, 0, 0.2])} ry={face(kA, HILL_TARGET)} pose={{ ...CROUCH, browUp: 0.8 }} seed={5} /><FillC /></Camp><Push p={add(kA, [1.6, 1.6, 2.2])} t={add(kA, [-1, 0.2, -4])} fov={46} /></Shot>; };
const Queue: React.FC = () => { const f = useCurrentFrame(); const looks: Look[] = [{ ...FRIEND, rollR: true }, { ...ADULT, rollR: true }, { ...SCRUBS, rollR: true }, { ...FRIEND, top: "#8A5A4A", rollR: true }]; return <>{CP_QUEUE.map((q, i) => <Char key={i} L={looks[i]} p={q} ry={face(q, CP_TABLE)} pose={i === 0 ? { shR: [-1.3, 0.3, -0.3], elR: -0.2, blink: blink(f, i) } : { blink: blink(f, i) }} seed={10 + i} />)}<Char L={{ ...GUARD, holdR: "flashlight" }} p={add(CP_TABLE, [0, 0, -0.7])} ry={face(CP_TABLE, CP_QUEUE[0])} pose={{ shR: [-1.3, 0, -0.3], elR: -0.4 }} seed={20} /></>; };
const SCampQueue: React.FC = () => <Shot><Camp lights={1}><Queue /><FillC /></Camp><Push p={add(CP_TABLE, [4.5, 2.2, 5])} t={add(CP_TABLE, [-0.6, 1.0, 0.5])} fov={22} k={0.002} /></Shot>;
const SCampGate: React.FC = () => { const f = useCurrentFrame(); const a = walkAt([0.6, 0, 4], Math.PI, f, 0.012); const b = walkAt([-0.3, 0, 4.2], Math.PI, f, 0.012); return <Shot><Camp lights={1}><Char L={KHUN} p={a.p} ry={Math.PI} pose={a.pose} seed={1} back={<Pack />} /><Char L={FON} p={b.p} ry={Math.PI} pose={walkPose(f / 6 + 1, 0.9)} seed={5} /><Char L={GUARD} p={CP_GUARD} ry={0} seed={21} /><FillC /></Camp><Push p={[2.2, 1.7, 8.5]} t={[0, 1.6, -3]} fov={42} /></Shot>; };
const SCampCheck: React.FC = () => { const f = useCurrentFrame(); const fa: V3 = add(CP_TABLE, [-0.2, 0, 0.6]); return <Shot><Camp lights={1} gateOpen={io(f, 30, 60, 0, 0.6)}><Fon at={fa} look={CP_TABLE} pose={{ shR: [-1.4, 0.3, -0.3], elR: -0.2 }} /><Char L={{ ...GUARD, holdR: "flashlight" }} p={add(CP_TABLE, [0, 0, -0.7])} ry={face(CP_TABLE, fa)} pose={{ shR: [-1.3, 0, -0.3], elR: -0.4 }} seed={20} /><K at={add(fa, [0.3, 0, 1.2])} look={CP_TABLE} pack /><FillC /></Camp><Push p={add(CP_TABLE, [1.8, 1.6, 2.6])} t={add(CP_TABLE, [-0.2, 1.0, 0.3])} fov={36} /></Shot>; };
const SCampFace: React.FC<{ scared?: boolean }> = ({ scared }) => { const at: V3 = add(CP_TABLE, [0.1, 0, 1.6]); const ry = face(at, CP_TABLE); const c = front(at, ry, 1.5); return <Shot><Camp lights={1}><pointLight position={[at[0], 2.4, at[2] - 0.8]} intensity={1.6} distance={4} color="#F4F0FF" /><K at={at} ry={ry} pose={scared ? SCARED : { browUp: 0.2, mouth: 0.05 }} pack puff={scared ? 1 : 0} /><FillC /></Camp><Push p={c.p} t={c.t} fov={32} /></Shot>; };
const SCampStill: React.FC = () => <Shot><Camp lights={1}><Queue /><K at={add(CP_TABLE, [0.1, 0, 1.6])} look={CP_TABLE} pack /><FillC /></Camp><Cam p={[6, 2.2, 7]} t={[0, 1.4, -2]} fov={40} drift={0.15} /></Shot>;
const STower: React.FC = () => <Shot><Camp lights={1}><Char L={GUARD} p={CP_TOWER} ry={face(CP_TOWER, CP_OUTSIDE)} pose={{ shR: [-1.6, 0, -0.2], elR: -1.6 }} seed={22} /><FillC /></Camp><Push p={add(CP_OUTSIDE, [-1.5, 0.6, 1])} t={add(CP_TOWER, [0, 1.4, 0])} fov={36} /></Shot>;
const SCatPack: React.FC = () => { const at: V3 = add(CP_TABLE, [0.1, 0, 1.6]); const ry = face(at, CP_TABLE); return <Shot><Camp lights={1}><K at={at} ry={ry} pack puff={1} pose={SCARED} /><Char L={GUARD} p={add(at, [0.7, 0, -0.2])} ry={face(add(at, [0.7, 0, -0.2]), at)} pose={{ shR: [-1.4, 0, -0.2], elR: -0.2 }} seed={23} /><FillC /></Camp><Push p={add(at, [-Math.sin(ry) * 1.0 + 0.2, FACE + 0.1, -Math.cos(ry) * 1.0])} t={add(at, [0, FACE - 0.25, 0])} fov={36} /></Shot>; };
const SCampClose: React.FC = () => { const f = useCurrentFrame(); return <Shot><Camp lights={1} gateOpen={io(f, 0, 50, 0.6, 0)}><Fon at={add(CP_INSIDE, [0.3, 0, 1.5])} ry={face(add(CP_INSIDE, [0.3, 0, 1.5]), CP_OUTSIDE)} pose={{ browUp: 1, mouth: 0.2 }} /><K at={add(CP_OUTSIDE, [0.2, 0, -1.6])} ry={Math.PI} pack /><FillC /></Camp><Push p={add(CP_OUTSIDE, [0.8, 1.7, 2.4])} t={add(CP_GATE, [0, 1.2, -1.5])} fov={40} /></Shot>; };

/* ─── the edit ─── */
const T = (n: number) => LINE[n - 1].t;
const E = (n: number) => LINE[n - 1].end;
const END = E(LINE.length) + 0.4;
const DAY_START: Record<number, number> = { 4: 31, 12: 32, 19: 35, 22: 38, 28: 41, 34: 45, 38: 48, 42: 52, 46: 56, 49: 60 };
const dayOf = (n: number) => { let d = 0; for (const [l, v] of Object.entries(DAY_START)) if (n >= Number(l)) d = v; return d; };
const RULES: [number, number, number, string][] = [
  [7, 11, 1, "เสียงใช้ล่อได้"], [13, 18, 2, "ห้ามเปิดไฟฉาย"], [20, 21, 3, "เดินชิดกำแพง"], [23, 27, 4, "ทางด่วนติด ทิ้งรถทันที"],
  [29, 33, 5, "ห้ามซ่อนในซูเปอร์ฯ"], [35, 37, 6, "เดินทางตอนฝนตก"], [40, 41, 7, "ข้อความซ้ำ อาจเป็นเทป"], [43, 45, 8, "กลางคืนห้ามก่อไฟ"],
  [47, 48, 9, "เฝ้าดูค่ายทั้งวัน"], [50, 50, 10, "ด่านตรวจทุกรอยข่วน"],
];
const SHOTS: Record<number, React.ReactNode[]> = {
  1: [<SCampHill />], 2: [<SKnob turn />], 3: [<SRoomWide />],
  4: [<SDoorIn />], 5: [<SDoorIn chain push />], 6: [<SDoorIn chain hand />], 7: [<SPhoneFace />], 8: [<SCorrPhone />], 9: [<SCorrNat />],
  10: [<SScratch />], 11: [<SCorrSneak />],
  12: [<SWell />], 13: [<SStairFace />], 14: [<SWell flash />], 15: [<SStairDown />], 16: [<SStairDown top={3} catClose />], 17: [<SWell top={3} z />], 18: [<SLobby />],
  19: [<SStreetOut />], 20: [<SStreetHigh />], 21: [<SSedan />],
  22: [<SHwWide />], 23: [<SHwInside />], 24: [<SHwHonker />], 25: [<SHwHigh />], 26: [<SHwHorde />], 27: [<SHwExit />],
  28: [<SMkDoor />], 29: [<SMkAisle />], 30: [<SMkHigh />], 31: [<SMkFon />], 32: [<SMkCatFon />], 33: [<SMkRun />],
  34: [<SRsRainWide />], 35: [<SRsWalk />], 36: [<SRsFeet />], 37: [<SRsWalk sign />],
  38: [<SRsRadio />], 39: [<SRsRadio close />], 40: [<SRsFaces />], 41: [<SRsLeave />],
  42: [<SRsNight />], 43: [<SRsNight hands />], 44: [<SRsFar />], 45: [<SRsNight blanket />],
  46: [<SCampHill day={0} />], 47: [<SCampHide />], 48: [<SCampQueue />], 49: [<SCampGate />], 50: [<SCampCheck />],
  51: [<SCampFace />], 52: [<SCampStill />], 53: [<SScratch light />, <SScratch dim={0.7} />], 54: [<STower />, <SCatPack />], 55: [<SCampClose />],
};

type Cut = { a: number; b: number; el: React.ReactNode };
const build = (): Cut[] => {
  const cuts: Cut[] = [];
  const n = LINE.length;
  for (let l = 1; l <= n; l++) {
    const a = l === 1 ? 0 : T(l) - 0.1;
    const b = l === n ? END : T(l + 1) - 0.1;
    const shots = SHOTS[l] ?? [];
    const day = dayOf(l);
    const rule = RULES.find(([s, e]) => l >= s && l <= e);
    const ov = (first: boolean) => <>
      {day ? <DayHUD day={day} of={60} /> : null}
      {rule ? <RuleTag n={rule[2]} text={rule[3]} /> : null}
      {first && DAY_START[l] ? <DayCard day={DAY_START[l]} /> : null}
      {first && l === 1 ? <TitleCard /> : null}
      {first && l === 25 ? <ProofCard title="แตรรถยนต์ดังประมาณ" big="100" unit="เดซิเบล" source="UNECE Regulation No. 28" y={330} /> : null}
      {first && l === 44 ? <ProofCard title="แสงเทียนในความมืดสนิท มองเห็นได้ไกล" big="2+" unit="กม." source="Ashkan & Hu, 2015" y={330} /> : null}
      {first && (l === 8 || l === 24 || l === 25 || l === 39 || l === 54) ? <Rings x={l === 54 ? 560 : 600} y={l === 54 ? 520 : 760} from={2} every={14} /> : null}
    </>;
    if (shots.length < 2) cuts.push({ a, b, el: <>{shots[0]}{ov(true)}</> });
    else { const m = (a + b) / 2; cuts.push({ a, b: m, el: <>{shots[0]}{ov(true)}</> }, { a: m, b, el: <>{shots[1]}{ov(false)}</> }); }
  }
  cuts.push({ a: END, b: DUR / FPS, el: <><BlurIn><SCampClose /></BlurIn><NextCard /></> });
  return cuts;
};
export const CUTS = build();

export const HERO_S = T(53) + 0.3;
export const Film: React.FC<{ noCaps?: boolean }> = ({ noCaps }) => (
  <AbsoluteFill style={{ background: "#07090F" }}>
    {CUTS.map((c, i) => (
      <Sequence key={i} from={fr(c.a)} durationInFrames={Math.max(1, fr(c.b) - fr(c.a))}>
        <AbsoluteFill>{c.el}</AbsoluteFill>
      </Sequence>
    ))}
    <Flash at={fr(HERO_S)} c="rgba(255,240,220,0.7)" />
    <Vig />
    <FadeOut from={DUR - 24} />
    <Grain amount={0.04} />
    {noCaps ? null : <Captions hideFrom={END} />}
  </AbsoluteFill>
);
