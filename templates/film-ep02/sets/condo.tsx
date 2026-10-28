import React from "react";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Pl, Sp, textTex, useTex, type V3 } from "../kit/three";

/** EP1 sets outside the room. Each set has its own origin; a shot renders ONE set.
 *
 *  Corridor (floor 14): hall x -1.3..1.3, z +1 .. -10, floor y=0, ceiling y=2.7.
 *    your door 1404 on the right wall (x=1.3) at z=-3, doormat in front of it (key under the mat on day 1)
 *    Pajit's door 1405 on the left wall (x=-1.3) at z=-3.4
 *    lift on the end wall z=-10 (doors open along x), red floor number above it
 *  Bathroom: tub along the back wall z=-1.2, blue bucket at x=0.9, tap on the wall above the tub
 *  Balcony: railing at z=0.9, the city below; the building across at z=-30 */

export const C_MYDOOR: V3 = [1.3, 0, -3];
export const C_PAJIT: V3 = [-1.3, 0, -3.4];
export const C_LIFT: V3 = [0, 0, -10];
/** EP2: stairwell door under the EXIT sign (left wall) */
export const C_STAIRDOOR: V3 = [-1.3, 0, -8.4];
/** EP2: a phone lying on the lift-lobby floor, screen lit */
export const C_PHONE: V3 = [0.35, 0, -8.6];

const WALL = "#CFC4AE", CARPET = "#6E2A2A", DOORW = "#7A4A32", BRASS = "#C9A455", STEEL = "#A8ADB4";

export type CorridorProps = {
  /** ceiling lights 0..1 (0 = blackout, only the green EXIT sign) */ power?: number;
  /** ceiling lights flicker */ flicker?: boolean;
  /** key under the doormat (pokes out) */ key1?: boolean;
  /** the cat bell lying on the doormat */ bell?: boolean;
  /** lift doors open 0..1 */ lift?: number;
  /** your door open 0..1 (swings into the room, away from camera) */ myDoor?: number;
  /** EP2: phone on the lift-lobby floor, screen lit 0..1 */ phone?: number;
  /** EP2: stairwell door (under EXIT) open 0..1 */ stairDoor?: number;
  children?: React.ReactNode;
};

export const Corridor: React.FC<CorridorProps> = ({ power = 1, flicker = false, key1 = false, bell = false, lift = 0, myDoor = 0, phone = 0, stairDoor = 0, children }) => {
  const f = useCurrentFrame();
  const fl = flicker ? (Math.sin(f * 1.7) > 0.6 || (f % 47) < 3 ? 0.25 : 1) : 1;
  const P = power * fl;
  const n1404 = textTex("1404", 256, 128, "#E9E6DC", "#22252E", 80, "plate1404");
  const n1405 = textTex("1405", 256, 128, "#E9E6DC", "#22252E", 80, "plate1405");
  const n14 = textTex("14", 128, 96, "#120808", "#FF3B2E", 80, "lift14");
  const exit = textTex("EXIT", 256, 96, "#1E7A3E", "#E9FFE9", 70, "exitsign");
  return (
    <group>
      <color attach="background" args={["#0A0807"]} />
      <ambientLight intensity={0.18 + 0.32 * P} color="#F2DCC0" />
      <hemisphereLight args={["#E8D8C0", "#2A1E18", 0.25 + 0.25 * P]} />
      {/* ceiling lights every 3 m */}
      {[0, -3, -6, -9].map((z) => (
        <group key={z}>
          <pointLight position={[0, 2.5, z]} intensity={2.0 * P} distance={5} color="#FFE6BE" />
          <Bx p={[0, 2.68, z]} s={[0.5, 0.03, 0.5]} c="#F4ECDC" e="#FFE6BE" ei={1.2 * P} />
          {P > 0.1 ? <Glow p={[0, 2.6, z]} s={1.1} o={0.4 * P} /> : null}
        </group>
      ))}
      {/* green EXIT over the stair door (left wall, near the lift): always on */}
      <Pl p={[-1.28, 2.3, -8.4]} s={[0.5, 0.19]} ry={Math.PI / 2} c="#fff" map={exit} e="#7CFF9C" ei={0.6} />
      <Glow p={[-1.2, 2.3, -8.4]} s={0.8} c="#7CFF9C" o={0.35} />
      <pointLight position={[-1.0, 2.2, -8.4]} intensity={0.6} distance={3} color="#7CFF9C" />
      {/* EP2: stair door under the EXIT sign (hinged toward the lift end, opens into the stairwell) */}
      <group position={[C_STAIRDOOR[0] + 0.02, 0, C_STAIRDOOR[2]]} rotation={[0, Math.PI / 2, 0]}>
        <Bx p={[0, 2.12, 0]} s={[1.08, 0.08, 0.12]} c="#4A4E54" />
        {[-1, 1].map((sd) => <Bx key={sd} p={[sd * 0.5, 1.05, 0]} s={[0.07, 2.14, 0.12]} c="#4A4E54" />)}
        <Bx p={[0, 1.06, -0.04]} s={[0.92, 2.0, 0.02]} c="#050505" />
        <group position={[0.46, 0, 0]} rotation={[0, stairDoor * 1.3, 0]}>
          <Bx p={[-0.46, 1.06, 0]} s={[0.92, 2.0, 0.05]} c="#5A6068" r={0.5} />
          <Bx p={[-0.7, 1.0, 0.05]} s={[0.4, 0.04, 0.04]} c="#9AA0A6" />
        </group>
      </group>
      {/* EP2: phone on the floor, screen up */}
      {phone > 0 ? <group position={[C_PHONE[0], 0.006, C_PHONE[2]]} rotation={[0, 0.5, 0]}>
        <Bx s={[0.075, 0.01, 0.15]} c="#1A1B1F" />
        <Bx p={[0, 0.0055, 0]} s={[0.066, 0.002, 0.135]} c="#BFD6F2" e="#BFD6F2" ei={1.2 * phone} />
        <pointLight position={[0, 0.15, 0]} intensity={0.5 * phone} distance={1.2} color="#BFD6F2" />
        <Glow p={[0, 0.03, 0]} s={0.4} c="#BFD6F2" o={0.4 * phone} />
      </group> : null}
      {/* shell */}
      <Bx p={[0, -0.05, -4.5]} s={[2.6, 0.1, 11]} c={CARPET} />
      <Bx p={[0, 2.75, -4.5]} s={[2.6, 0.1, 11]} c="#2E2620" />
      <Bx p={[-1.35, 1.35, -4.5]} s={[0.1, 2.7, 11]} c={WALL} />
      <Bx p={[1.35, 1.35, -4.5]} s={[0.1, 2.7, 11]} c={WALL} />
      <Bx p={[0, 1.35, 1.05]} s={[2.6, 2.7, 0.1]} c={WALL} />
      {/* your door 1404 (right wall) + doormat */}
      <group position={[C_MYDOOR[0] - 0.02, 0, C_MYDOOR[2]]} rotation={[0, -Math.PI / 2, 0]}>
        <Bx p={[0, 2.12, 0]} s={[1.08, 0.08, 0.12]} c="#5A3624" />
        {[-1, 1].map((sd) => <Bx key={sd} p={[sd * 0.5, 1.05, 0]} s={[0.07, 2.14, 0.12]} c="#5A3624" />)}
        <group position={[-0.46, 0, 0]} rotation={[0, myDoor * 1.2, 0]}>
          <Bx p={[0.46, 1.06, 0]} s={[0.92, 2.0, 0.05]} c={DOORW} />
          {[1.5, 0.6].map((y) => <Bx key={y} p={[0.46, y, -0.03]} s={[0.66, 0.7, 0.012]} c="#6A3E2A" />)}
          <Bx p={[0.82, 1.0, -0.05]} s={[0.04, 0.16, 0.05]} c={BRASS} />
          <Sp p={[0.82, 1.0, -0.08]} r={0.03} c={BRASS} />
        </group>
        <Pl p={[0, 2.38, -0.07]} s={[0.4, 0.2]} ry={Math.PI} c="#fff" map={n1404} />
      </group>
      <group position={[C_MYDOOR[0] - 0.5, 0.012, C_MYDOOR[2]]}>
        <Bx s={[0.55, 0.02, 0.85]} c="#8A6A44" />
        {key1 ? <group position={[-0.29, 0.014, 0.12]} rotation={[0, 0.5, 0]}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.006, 6, 14]} /><meshStandardMaterial color="#C9A94A" metalness={0.6} roughness={0.35} /></mesh><Bx p={[-0.05, 0, 0]} s={[0.07, 0.006, 0.014]} c="#C9A94A" /></group> : null}
        {bell ? <Sp p={[-0.1, 0.03, -0.2]} r={0.022} c="#D9B24A" /> : null}
      </group>
      {/* Pajit's door 1405 (left wall) */}
      <group position={[C_PAJIT[0] + 0.02, 0, C_PAJIT[2]]} rotation={[0, Math.PI / 2, 0]}>
        <Bx p={[0, 2.12, 0]} s={[1.08, 0.08, 0.12]} c="#5A3624" />
        {[-1, 1].map((sd) => <Bx key={sd} p={[sd * 0.5, 1.05, 0]} s={[0.07, 2.14, 0.12]} c="#5A3624" />)}
        <Bx p={[0, 1.06, 0]} s={[0.92, 2.0, 0.05]} c="#6E4630" />
        <Bx p={[0.36, 1.0, 0.05]} s={[0.04, 0.16, 0.05]} c={BRASS} />
        <Pl p={[0, 2.38, 0.07]} s={[0.4, 0.2]} c="#fff" map={n1405} />
      </group>
      {/* lift: steel frame, two doors sliding apart, red floor number */}
      <group position={C_LIFT}>
        <Bx p={[0, 1.15, 0.03]} s={[1.3, 2.3, 0.06]} c="#5C5F66" />
        <Bx p={[0, 1.1, -0.6]} s={[1.0, 2.2, 1.1]} c="#B9B2A2" />
        <pointLight position={[0, 2.0, -0.6]} intensity={1.6 * lift} distance={2.5} color="#EAF2FF" />
        {[-1, 1].map((sd) => <Bx key={sd} p={[sd * (0.25 + lift * 0.48), 1.05, 0.07]} s={[0.5, 2.1, 0.03]} c={STEEL} r={0.35} />)}
        <Pl p={[0, 2.48, 0.08]} s={[0.36, 0.26]} c="#fff" map={n14} e="#FF3B2E" ei={0.5} />
        <Glow p={[0, 2.48, 0.12]} s={0.5} c="#FF5040" o={0.35} />
        <Bx p={[0.8, 1.1, 0.07]} s={[0.1, 0.22, 0.02]} c="#2A2D33" />
      </group>
      {children}
    </group>
  );
};

export type BathroomProps = { /** tub water 0..1 */ water?: number; /** water running from the tap 0..1 */ flow?: number; /** water turned murky 0..1 */ murk?: number; /** daylight 0..1 */ day?: number; children?: React.ReactNode };

export const Bathroom: React.FC<BathroomProps> = ({ water = 0, flow = 0, murk = 0, day = 1, children }) => {
  const f = useCurrentFrame();
  const wc = murk > 0.5 ? "#7C8A5E" : "#8FB8C8";
  return (
    <group>
      <color attach="background" args={["#0C0C0E"]} />
      <ambientLight intensity={0.35 + 0.25 * day} color="#E8EEF2" />
      <hemisphereLight args={["#EEF2F4", "#3A3A3A", 0.4]} />
      <pointLight position={[0.3, 2.3, 0.4]} intensity={1.6 * day} distance={5} color="#F4F0E6" />
      {/* small tiled room x -1.5..1.5, z -1.5..1.5 */}
      <Bx p={[0, -0.05, 0]} s={[3, 0.1, 3]} c="#C9CDD0" />
      <Bx p={[0, 1.35, -1.55]} s={[3, 2.7, 0.1]} c="#DCE3E6" />
      <Bx p={[-1.55, 1.35, 0]} s={[0.1, 2.7, 3]} c="#D3DADD" />
      <Bx p={[1.55, 1.35, 0]} s={[0.1, 2.7, 3]} c="#D3DADD" />
      {Array.from({ length: 10 }, (_, i) => <Bx key={i} p={[-1.5 + i * 0.3, 1.35, -1.49]} s={[0.006, 2.7, 0.004]} c="#B8C2C6" />)}
      {/* tub */}
      <group position={[-0.4, 0, -1.05]}>
        <Bx p={[0, 0.27, 0]} s={[1.7, 0.54, 0.8]} c="#F2F2EE" />
        <Bx p={[0, 0.52, 0]} s={[1.56, 0.06, 0.66]} c="#E4E6E4" />
        {water > 0 ? <Bx p={[0, 0.12 + water * 0.38, 0]} s={[1.54, 0.02, 0.64]} c={wc} o={0.85} /> : null}
        {/* tap on the wall */}
        <Cy p={[0.5, 0.95, -0.38]} r={0.025} h={0.16} c="#B9BEC4" rx={Math.PI / 2} />
        <Cy p={[0.5, 0.9, -0.29]} r={0.02} h={0.08} c="#B9BEC4" />
        {flow > 0 ? <Cy p={[0.5, 0.86 - (0.86 - (0.12 + water * 0.38)) / 2, -0.29]} r={0.008 * flow + 0.002} h={0.86 - (0.12 + water * 0.38)} c="#BFE0EE" e="#BFE0EE" ei={0.2} /> : null}
        {flow > 0 && f % 6 < 3 ? <Sp p={[0.5, 0.13 + water * 0.38, -0.29]} r={0.03 * flow} c="#DDF0F8" sc={[1.4, 0.3, 1.4]} /> : null}
      </group>
      {/* blue bucket + pots on the floor */}
      <group position={[0.95, 0, -0.6]}>
        <Cy p={[0, 0.22, 0]} r={0.2} r2={0.24} h={0.44} c="#3A7BC8" />
        {water > 0 ? <Cy p={[0, 0.4, 0]} r={0.22} h={0.02} c={wc} /> : null}
        <mesh position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.235, 0.012, 6, 24]} /><meshStandardMaterial color="#2E64A8" /></mesh>
      </group>
      {[[0.55, 0.3], [0.95, 0.2], [0.3, 0.55]].map(([x, z], i) => <Cy key={i} p={[x, 0.1, z]} r={0.13} h={0.2} c="#9AA0A8" />)}
      {children}
    </group>
  );
};

export type BalconyProps = { /** city lights 0..1 */ city?: number; /** the one lit window across the street 0..1 */ lit?: number; /** the lit window's door shown open (next morning: daylight) */ day?: number; children?: React.ReactNode };

export const Balcony: React.FC<BalconyProps> = ({ city = 0, lit = 0, day = 0, children }) => {
  const sky = useTex(512, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#0A1024"); gr.addColorStop(1, "#2C3A5E");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 60; i++) { g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect((i * 97) % 512, (i * 53) % 120, 2, 2); }
  }, "balconysky");
  const daySky = useTex(512, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#A8B6C2"); gr.addColorStop(1, "#D9CFBC"); g.fillStyle = gr; g.fillRect(0, 0, 512, 256); }, "balconyday");
  return (
    <group>
      <color attach="background" args={[day ? "#B8C2C8" : "#05070D"]} />
      <ambientLight intensity={day ? 0.9 : 0.7} color={day ? "#F4EEE2" : "#8090C0"} />
      {!day ? <pointLight position={[0.6, 2.2, 1.6]} intensity={1.4} distance={4} color="#AFC0F0" /> : null}
      <directionalLight position={[3, 6, 4]} intensity={day ? 1.1 : 0.25} color={day ? "#FFF2DC" : "#9FB0E0"} />
      <Pl p={[0, 12, -60]} s={[160, 60]} c="#fff" map={day ? daySky : sky} e="#fff" ei={day ? 0.8 : 0.9} />
      {/* balcony floor + railing */}
      <Bx p={[0, -0.05, 0]} s={[3, 0.1, 2]} c="#8C8478" />
      <Bx p={[0, 1.05, 0.95]} s={[3, 0.05, 0.05]} c="#3A3D44" />
      {Array.from({ length: 13 }, (_, i) => <Bx key={i} p={[-1.5 + i * 0.25, 0.52, 0.95]} s={[0.02, 1.05, 0.02]} c="#3A3D44" />)}
      {/* the city: blocks at different depths; windows light with `city` */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = -40 + i * 5.5, z = -22 - (i % 4) * 7, h = 10 + ((i * 7) % 13), w = 4;
        return (
          <group key={i} position={[x, -14, z]}>
            <Bx p={[0, h / 2, 0]} s={[w, h, 3]} c={day ? "#8A8E94" : "#232B40"} />
            {Array.from({ length: 12 }, (_, k) => <Bx key={k} p={[-1.2 + (k % 3) * 1.2, 2 + Math.floor(k / 3) * 2.2, 1.52]} s={[0.6, 0.8, 0.02]} c="#F2C878" e="#F2C878" ei={((i * 13 + k * 7) % 5 < 2 ? 1 : 0) * city * 1.2} o={city > 0 || day ? 1 : 0.25} />)}
          </group>
        );
      })}
      {/* the building across the street with ONE lit window */}
      <group position={[9, -10, -45]}>
        <Bx p={[0, 6, 0]} s={[8, 20, 3]} c={day ? "#9A9690" : "#1E2536"} />
        {Array.from({ length: 20 }, (_, k) => <Bx key={k} p={[-3 + (k % 5) * 1.5, 3 + Math.floor(k / 5) * 2.4, 1.52]} s={[0.8, 1.0, 0.02]} c={day ? "#3A3E46" : "#1A1F2C"} />)}
        <Bx p={[1.5, 3 + 2 * 2.4, 1.53]} s={[0.8, 1.0, 0.02]} c={day ? "#1A1D22" : "#FFD48A"} e="#FFD48A" ei={day ? 0 : lit * 2.2} />
        {lit > 0 && !day ? <Glow p={[1.5, 3 + 2 * 2.4, 1.7]} s={3} o={0.7 * lit} /> : null}
      </group>
      {children}
    </group>
  );
};
