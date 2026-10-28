import React from "react";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Pl, Sp, rnd, useTex, type V3 } from "../kit/three";

/** EP2 safe-camp gate. Origin = the road in front of the gate (outside), the camp lies toward -z.
 *
 *  Chain-link fence line at z=-4, x -14..14, 3 m tall with posts every 2.5 m; gate opening x -2..2 (two leaves
 *  hinged at x=±2, swing inward toward -z). Hand-painted sign "ค่ายปลอดภัย" on a board above the gate (y=3.6).
 *  Sandbag walls flank the gate outside (x ±3.2, z -3). Guard tower inside at x=-5, z=-7 (platform y=4).
 *  Floodlight poles at x ±4.5, z -4.4 (lamps y=5.5 aimed at the road). Tents in rows behind, z -10 .. -18.
 *  The approach road runs toward +z. */

export const CP_GATE: V3 = [0, 0, -4];
export const CP_OUTSIDE: V3 = [0.3, 0, 0];      // you, on the road in front of the gate
export const CP_INSIDE: V3 = [0, 0, -7];        // just through the gate
export const CP_GUARD: V3 = [1.4, 0, -4.8];     // a guard behind the gate
export const CP_TOWER: V3 = [-5, 4, -7];        // guard on the tower platform
export const CP_CAT: V3 = [0.85, 0, 0.2];       // cat beside you
export const CP_TABLE: V3 = [2.6, 0, -1.6];     // checkpoint table outside the gate (guard sits/stands behind it at z -2.3)
export const CP_QUEUE: V3[] = [[1.6, 0, -0.6], [1.5, 0, 0.4], [1.7, 0, 1.4], [1.5, 0, 2.4]]; // queue to the table, front first
export const HILL_CAM: V3 = [-14, 9, 22];        // hill viewpoint looking down at the camp
export const HILL_TARGET: V3 = [0, 0, -8];
export const CP_CAM: V3 = [3.4, 1.8, 4.6];      // 3/4 toward the gate; look at CP_LOOK
export const CP_LOOK: V3 = [-0.4, 1.8, -4];

const SAND = "#A8946A";

export type CampProps = {
  /** floodlights 0..1 */ lights?: number;
  /** gate open 0..1 */ gateOpen?: number;
  /** 0 night .. 1 day */ day?: number;
  children?: React.ReactNode;
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const Camp: React.FC<CampProps> = ({ lights = 1, gateOpen = 0, day = 0, children }) => {
  const f = useCurrentFrame();
  const L = lights * (1 - 0.7 * day);
  const sign = useTex(512, 160, (g) => {
    g.fillStyle = "#E4DCC6"; g.fillRect(0, 0, 512, 160);
    g.fillStyle = "rgba(90,70,40,0.25)"; for (let i = 0; i < 12; i++) g.fillRect(0, i * 14, 512, 2);
    g.fillStyle = "#B0201A"; g.font = "bold 92px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.save(); g.translate(256, 84); g.rotate(-0.025); g.fillText("ค่ายปลอดภัย", 0, 0); g.restore();
    g.fillStyle = "rgba(176,32,26,0.8)"; g.fillRect(380, 118, 4, 30); g.fillRect(140, 122, 3, 22);
  }, "cp-sign");
  const fence = useTex(128, 128, (g) => {
    g.clearRect(0, 0, 128, 128); g.strokeStyle = "rgba(190,195,200,1)"; g.lineWidth = 3;
    for (let i = -128; i < 256; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 128, 128); g.stroke(); g.beginPath(); g.moveTo(i + 128, 0); g.lineTo(i, 128); g.stroke(); }
  }, "cp-chain");
  const D = day > 0.5;
  const Mesh: React.FC<{ p: V3; w: number; h: number }> = ({ p, w, h }) => (
    <mesh position={p}><planeGeometry args={[w, h]} /><meshStandardMaterial map={fence} transparent alphaTest={0.3} side={2} color="#C0C4C8" roughness={0.6} /></mesh>
  );
  return (
    <group>
      <color attach="background" args={[D ? "#A8B0B4" : "#06080E"]} />
      <ambientLight intensity={mix(0.15, 0.85, day)} color={D ? "#F0EEE6" : "#6878A8"} />
      <hemisphereLight args={[D ? "#D0D8DC" : "#3A4470", "#1A160E", mix(0.2, 0.6, day)]} />
      <directionalLight position={[6, 12, 8]} intensity={mix(0.2, 1.1, day)} color={D ? "#FFF2DC" : "#9AACE0"} />
      {/* ground: dirt road outside, compound inside */}
      <Bx p={[0, -0.05, -6]} s={[40, 0.1, 40]} c={D ? "#8A7A5E" : "#3A3428"} />
      <Bx p={[0, 0.002, 6]} s={[4.5, 0.01, 20]} c={D ? "#9A8A6A" : "#4A4232"} />
      {Array.from({ length: 14 }, (_, i) => <Sp key={i} p={[(rnd(i) - 0.5) * 4, 0.01, rnd(i * 3) * 12 - 2]} r={0.25} c="#2E2A20" sc={[1.4, 0.02, 1]} />)}
      {/* fence posts + chain-link + barbed top */}
      {Array.from({ length: 13 }, (_, i) => {
        const x = -14 + i * 2.5;
        return Math.abs(x) < 2 ? null : <Cy key={i} p={[x, 1.5, -4]} r={0.05} h={3} c="#7A7E84" />;
      })}
      <Mesh p={[-8, 1.45, -4]} w={12} h={2.9} />
      <Mesh p={[8, 1.45, -4]} w={12} h={2.9} />
      {[-8, 8].map((x) => <Bx key={x} p={[x, 3.0, -4]} s={[12, 0.02, 0.02]} c="#6A6E74" />)}
      {[-8, 8].map((x) => <Bx key={`b${x}`} p={[x, 3.15, -4.05]} s={[12, 0.015, 0.015]} c="#6A6E74" />)}
      {/* gate: two leaves */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[sd * 2, 0, -4]} rotation={[0, sd * gateOpen * 1.4, 0]}>
          <Bx p={[-sd * 1, 0.1, 0]} s={[2, 0.06, 0.06]} c="#6A6E74" />
          <Bx p={[-sd * 1, 2.6, 0]} s={[2, 0.06, 0.06]} c="#6A6E74" />
          <Bx p={[-sd * 1.97, 1.35, 0]} s={[0.06, 2.5, 0.06]} c="#6A6E74" />
          <Mesh p={[-sd * 1, 1.35, 0]} w={2} h={2.5} />
        </group>
      ))}
      {[-2, 2].map((x) => <Cy key={x} p={[x, 1.9, -4]} r={0.09} h={3.8} c="#5A5E64" />)}
      {/* hand-painted sign over the gate */}
      <Bx p={[0, 3.6, -4.05]} s={[3.4, 1.08, 0.06]} c="#5A4A36" />
      <Pl p={[0, 3.6, -4.0]} s={[3.2, 1.0]} c="#fff" map={sign} />
      {/* barbed-wire coils along the fence top */}
      {[-1, 1].map((sd) => Array.from({ length: 24 }, (_, i) => <mesh key={`bw${sd}${i}`} position={[sd * (2.25 + i * 0.5), 3.25, -4]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.18, 0.008, 4, 16]} /><meshStandardMaterial color="#8A8E94" roughness={0.5} /></mesh>))}
      {/* checkpoint table + the guard flashlight (lit, lying on it) */}
      <group position={CP_TABLE}>
        <Bx p={[0, 0.74, 0]} s={[1.6, 0.05, 0.7]} c="#6A5A42" />
        {[[-0.72, -0.3], [0.72, -0.3], [-0.72, 0.3], [0.72, 0.3]].map(([x, z], i) => <Bx key={i} p={[x, 0.36, z]} s={[0.05, 0.72, 0.05]} c="#4A3E2E" />)}
        <Bx p={[-0.3, 0.775, 0.05]} s={[0.4, 0.01, 0.3]} c="#E8E4D8" />
        <group position={[0.4, 0.8, 0]} rotation={[0, 0.6, Math.PI / 2]}>
          <Cy r={0.025} h={0.24} c="#2A2C31" />
          <Cy p={[0, 0.13, 0]} r={0.034} h={0.04} c="#F4F0D8" e="#FFF4D6" ei={2 * (1 - day)} />
        </group>
        {day < 0.5 ? <Glow p={[0.55, 0.8, 0.1]} s={0.8} c="#FFF4D6" o={0.6} /> : null}
        {day < 0.5 ? <spotLight position={[0.55, 0.82, 0.1]} angle={0.4} penumbra={0.5} intensity={6} distance={6} color="#FFF4D6" /> : null}
        <Bx p={[-1.1, 0.25, -0.6]} s={[0.45, 0.5, 0.45]} c="#4A6A4A" />
      </group>
      {/* sandbag walls */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[sd * 3.2, 0, -3]}>
          {Array.from({ length: 4 }, (_, row) => Array.from({ length: 5 - (row % 2) }, (_, k) => (
            <Sp key={`${row}-${k}`} p={[-0.9 + k * 0.45 + (row % 2) * 0.22, 0.12 + row * 0.2, 0]} r={0.24} c={rnd(row * 7 + k + sd) > 0.5 ? SAND : "#9A8660"} sc={[1, 0.45, 0.65]} />
          )))}
        </group>
      ))}
      {/* floodlight poles */}
      {[-4.5, 4.5].map((x) => (
        <group key={x} position={[x, 0, -4.4]}>
          <Cy p={[0, 2.8, 0]} r={0.08} h={5.6} c="#5A5E64" />
          <Bx p={[0, 5.5, 0.15]} s={[0.6, 0.4, 0.25]} rx={0.4} c="#2A2C30" />
          <Bx p={[0, 5.45, 0.29]} s={[0.5, 0.3, 0.02]} rx={0.4} c="#F4F4EC" e="#F4FAFF" ei={2.5 * L} />
          {L > 0.05 ? <><Glow p={[0, 5.4, 0.45]} s={2.6} c="#E8F0FF" o={0.7 * L} /><spotLight position={[0, 5.4, 0.4]} angle={0.7} penumbra={0.6} intensity={30 * L} distance={18} color="#EAF0FF" /></> : null}
        </group>
      ))}
      {/* guard tower */}
      <group position={[CP_TOWER[0], 0, CP_TOWER[2]]}>
        {[[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].map(([x, z], i) => <Bx key={i} p={[x, 2, z]} s={[0.14, 4, 0.14]} c="#5A4A36" />)}
        <Bx p={[0, 4, 0]} s={[2.2, 0.12, 2.2]} c="#6A5A42" />
        <Bx p={[0, 4.5, 1.08]} s={[2.2, 0.9, 0.06]} c="#6A5A42" />
        <Bx p={[1.08, 4.5, 0]} s={[0.06, 0.9, 2.2]} c="#6A5A42" />
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <Bx key={i} p={[x, 5.3, z]} s={[0.08, 1.6, 0.08]} c="#5A4A36" />)}
        <Bx p={[0, 6.15, 0]} s={[2.6, 0.1, 2.6]} rz={0.05} c="#4A4E46" />
        {/* megaphone hanging on the rail */}
        <group position={[-0.95, 4.75, 1.12]} rotation={[0.3, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.13, 0.32, 16, 1, true]} /><meshStandardMaterial color="#E8E4D8" side={2} /></mesh>
          <Cy p={[0, -0.12, -0.12]} r={0.03} h={0.14} c="#C83A2A" />
        </group>
        {/* searchlight sweeping */}
        <group position={[0.9, 4.9, 0.9]} rotation={[0, Math.sin(f / 30) * 0.6 + 0.6, 0]}>
          <Cy p={[0, 0, 0.15]} r={0.12} h={0.3} rx={Math.PI / 2} c="#2A2C30" />
          <Cy p={[0, 0, 0.31]} r={0.1} h={0.02} rx={Math.PI / 2} c="#F4FAFF" e="#F4FAFF" ei={3 * L} />
          {L > 0.05 ? <Glow p={[0, 0, 0.4]} s={1.4} c="#E8F0FF" o={0.6 * L} /> : null}
        </group>
      </group>
      {/* tents behind */}
      {Array.from({ length: 10 }, (_, i) => {
        const x = -8 + (i % 5) * 4 + (rnd(i) - 0.5), z = -11 - Math.floor(i / 5) * 5;
        const c = ["#4A6A4A", "#3A5A7A", "#6A6A5A"][i % 3];
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.85, 0]} rotation={[0, 0, 0]}><coneGeometry args={[1.5, 1.7, 4]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>
            {i === 2 || i === 7 ? <><Sp p={[0, 0.5, 1.15]} r={0.08} c="#FFD9A0" e="#FFC070" ei={2 * (1 - day)} /><Glow p={[0, 0.5, 1.3]} s={0.8} o={0.4 * (1 - day)} /></> : null}
          </group>
        );
      })}
      {children}
    </group>
  );
};


