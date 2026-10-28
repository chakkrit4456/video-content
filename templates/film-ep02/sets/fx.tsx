import React from "react";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Sp, rnd, type V3 } from "../kit/three";

/** EP2 shared set pieces: rain streaks, wet-floor sheen, smoke puffs, a low-poly car. Deterministic (rnd + frame only). */

/** falling rain streaks inside a box centred on `c` (size `s`). amt 0..1 */
export const Rain: React.FC<{ c: V3; s: V3; amt: number; n?: number; seed?: number }> = ({ c, s, amt, n = 160, seed = 0 }) => {
  const f = useCurrentFrame();
  if (amt <= 0) return null;
  const k = Math.round(n * amt);
  return (
    <group position={c}>
      {Array.from({ length: k }, (_, i) => {
        const x = (rnd(i + seed) - 0.5) * s[0], z = (rnd(i * 3.1 + seed) - 0.5) * s[2];
        const sp = 0.55 + rnd(i * 7.7 + seed) * 0.3; // fraction of box height per frame
        const y = s[1] / 2 - (((rnd(i * 5.3 + seed) + f * sp * 0.12) % 1) * s[1]);
        return <Bx key={i} p={[x, y, z]} s={[0.008, 0.34, 0.008]} rz={0.08} c="#B8C8D8" e="#B8C8D8" ei={0.25} o={0.55} />;
      })}
    </group>
  );
};

/** glossy dark layer over a floor (wet asphalt). s = [w, d] */
export const Wet: React.FC<{ p: V3; s: [number, number]; amt: number }> = ({ p, s, amt }) =>
  amt > 0 ? (
    <mesh position={p} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={s} />
      <meshStandardMaterial color="#1A2230" roughness={0.12} metalness={0.4} transparent opacity={0.45 * amt} />
    </mesh>
  ) : null;

/** slow rising grey puffs (a burning car, a far fire). amt 0..1 */
export const Smoke: React.FC<{ p: V3; amt: number; dark?: boolean }> = ({ p, amt, dark = true }) => {
  const f = useCurrentFrame();
  if (amt <= 0) return null;
  return (
    <group position={p} scale={amt}>
      {Array.from({ length: 9 }, (_, i) => {
        const t = ((f / 90 + i / 9) % 1);
        return <Sp key={i} p={[Math.sin(i * 2.1 + f / 40) * 0.3 * t, t * 4, Math.cos(i * 1.7) * 0.3 * t]} r={0.3 + t * 0.9} c={dark ? "#3A3836" : "#8A8884"} sc={[1, 0.8, 1]} />;
      })}
    </group>
  );
};

export const CAR_COLORS = ["#B8BCC2", "#2E3138", "#8A2A2A", "#F0EEE8", "#3A5A80", "#6A7A5A", "#C9A050", "#4A4A50"];

export type CarProps = {
  p: V3; ry?: number; c: string;
  /** driver (left, -x) door open 0..1 */ door?: number;
  /** passenger door open 0..1 */ door2?: number;
  /** head/tail lights 0..1 */ lights?: number;
  /** brake lights on hard 0..1 */ brake?: number;
  /** interior: steering wheel + key in the ignition (hero car) */ interior?: boolean;
  /** glow halos on the head lights (costly; only for near cars) */ halo?: boolean;
};
/** low-poly sedan, 1.8 x 4.3 m, nose toward -z (local). Driver door on the -x side. */
export const Car: React.FC<CarProps> = ({ p, ry = 0, c, door = 0, door2 = 0, lights = 0, halo = false, brake = 0, interior = false }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Bx p={[0, 0.55, 0]} s={[1.78, 0.5, 4.3]} c={c} r={0.6} />
    <Bx p={[0, 1.0, 0.25]} s={[1.6, 0.44, 2.1]} c={c} r={0.6} />
    {/* glass band */}
    <Bx p={[0, 1.0, 0.25]} s={[1.62, 0.3, 1.9]} c="#1E2630" r={0.2} />
    <Bx p={[0, 0.96, -0.86]} s={[1.5, 0.34, 0.06]} rx={-0.6} c="#24303C" r={0.2} />
    {/* wheels */}
    {[[-0.85, -1.35], [0.85, -1.35], [-0.85, 1.35], [0.85, 1.35]].map(([x, z], i) => <Cy key={i} p={[x, 0.32, z]} r={0.32} h={0.22} c="#16171A" rz={Math.PI / 2} seg={12} />)}
    {/* head + tail lights */}
    {[-0.6, 0.6].map((x) => (
      <group key={x}>
        <Bx p={[x, 0.62, -2.16]} s={[0.36, 0.12, 0.04]} c="#EEE8D8" e="#FFF2D0" ei={2 * lights} />
        <Bx p={[x, 0.66, 2.16]} s={[0.36, 0.1, 0.04]} c="#6A1414" e="#FF2A1A" ei={1.6 * lights + 3 * brake} />
        {halo && lights > 0 ? <Glow p={[x, 0.62, -2.3]} s={1.2} c="#FFF0C8" o={0.5 * lights} /> : null}
        {(halo && lights > 0) || brake > 0 ? <Glow p={[x, 0.66, 2.3]} s={0.7 + brake} c="#FF3A2A" o={0.4 * lights + 0.5 * brake} /> : null}
      </group>
    ))}
    {/* doors: hinged at the front edge, swing outward */}
    <group position={[-0.9, 0, -0.55]} rotation={[0, -door * 1.1, 0]}>
      <Bx p={[0, 0.75, 0.55]} s={[0.06, 0.8, 1.1]} c={c} r={0.6} />
      <Bx p={[-0.04, 0.8, 0.85]} s={[0.03, 0.04, 0.16]} c="#2A2A2E" />
    </group>
    <group position={[0.9, 0, -0.55]} rotation={[0, door2 * 1.1, 0]}>
      <Bx p={[0, 0.75, 0.55]} s={[0.06, 0.8, 1.1]} c={c} r={0.6} />
    </group>
    {interior ? <>
      {[-0.4, 0.4].map((x) => <Bx key={x} p={[x, 0.85, 0.35]} s={[0.55, 0.6, 0.12]} rx={-0.15} c="#2A2622" />)}
      <Bx p={[0, 0.78, -0.75]} s={[1.6, 0.2, 0.4]} c="#1E1E22" />
      <mesh position={[-0.4, 0.9, -0.45]} rotation={[-1.1, 0, 0]}><torusGeometry args={[0.17, 0.02, 8, 24]} /><meshStandardMaterial color="#141416" roughness={0.6} /></mesh>
      <Bx p={[-0.12, 0.8, -0.56]} s={[0.012, 0.05, 0.03]} c="#D8DCE0" e="#FFFFFF" ei={0.4} />
      <mesh position={[-0.12, 0.76, -0.54]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.014, 0.003, 6, 12]} /><meshStandardMaterial color="#C9A94A" /></mesh>
    </> : null}
    {door > 0.05 ? <Bx p={[-0.2, 0.62, -0.1]} s={[0.55, 0.12, 0.55]} c="#2A2622" /> : null}
  </group>
);

