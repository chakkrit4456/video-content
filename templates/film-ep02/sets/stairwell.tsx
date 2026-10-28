import React from "react";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Pl, textTex, type V3 } from "../kit/three";

/** EP2 fire stairs. Origin = the landing of the TOP storey shown (`top`, default floor 14).
 *
 *  Shaft x -1.6..1.6, z +1.2 .. -3.4. Each storey = 3 m (ST_H); storey k (0 = top) has its landing at y = -3k,
 *  z +1.2..-0.2, with its own steel fire door in the front wall (z=1.2, x=-0.6), a green EXIT sign over it and its
 *  floor number painted big on the left wall (x=-1.6). Two flights per storey wrap round an OPEN central well
 *  (x -0.15..0.15, you can look down it): flight A goes down along +x (x 0.15..1.55) toward -z to a mid landing at
 *  y=-3k-1.5 (z -2.0..-3.4); flight B comes back along -x toward +z to the next landing. Dark iron rails line the well.
 *  For floor 3 / floor 2 scenes render with top={3} (floor 2 = storey 1, ST_DOWN). */

export const ST_H = 3;
export const ST_LANDING: V3 = [-0.6, 0, 0.4];   // where you stand on the top landing
export const ST_TOP_STEP: V3 = [0.85, 0, -0.3];  // head of the first flight going down
export const ST_MID: V3 = [0, -1.5, -2.7];       // mid landing (turn)
export const ST_DOWN: V3 = [-0.8, -3, 0.4];      // next storey's landing (top-1)
export const ST_CAT: V3 = [-0.1, 0, 0.6];        // cat beside you on the landing
export const ST_DOOR: V3 = [-0.6, 0, 1.2];       // the top storey's fire door (front wall); storey k: y - 3k
export const ST_WELL: V3 = [0, 0, -1.1];         // top of the open well (look down from here)
export const ST_CAM: V3 = [1.3, 1.6, 1.0];       // good 3/4 camera, look at ST_LOOK
export const ST_LOOK: V3 = [-0.3, 0.2, -0.8];
export const ST_WELL_CAM: V3 = [0.25, 1.4, -0.9]; // looking straight down the well; look at ST_WELL_LOOK
export const ST_WELL_LOOK: V3 = [0, -8, -1.1];

const CONC = "#7E7A72", CONC_D = "#5E5A54", IRON = "#2A2C30", STEP = "#8A857C";

export type StairwellProps = {
  /** bulkhead lights 0..1 (0 = blackout: only the EXIT signs) */ power?: number;
  /** EXIT signs strength 0..1 (battery backup) */ exitGlow?: number;
  /** floor number of the top landing */ top?: number;
  /** how many storeys down are built (1..4) */ floors?: number;
  /** door of storey 1 (the floor below top) open 0..1, e.g. the floor-2 door with top={3} */ doorBelow?: number;
  children?: React.ReactNode;
};

const Flight: React.FC<{ x: number; y0: number; z0: number; dir: 1 | -1 }> = ({ x, y0, z0, dir }) => (
  <group>
    {Array.from({ length: 10 }, (_, i) => (
      <Bx key={i} p={[x, y0 - 0.15 * (i + 1) + 0.075, z0 + dir * (0.18 + 0.18 * i)]} s={[1.4, 0.15, 0.3]} c={i % 2 ? STEP : "#837E75"} />
    ))}
    <Bx p={[x, y0 - 0.95, z0 + dir * 0.95]} s={[1.4, 0.12, 2.1]} rx={dir * 0.69} c={CONC_D} />
  </group>
);

export const Stairwell: React.FC<StairwellProps> = ({ power = 1, exitGlow = 1, top = 14, floors = 2, doorBelow = 0, children }) => {
  const f = useCurrentFrame();
  const P = power;
  const exit = textTex("EXIT", 256, 96, "#1E7A3E", "#E9FFE9", 70, "exitsign");
  const buzz = 0.92 + 0.08 * Math.sin(f * 0.9);
  return (
    <group>
      <color attach="background" args={["#060606"]} />
      <ambientLight intensity={0.08 + 0.22 * P} color="#E8DCC8" />
      <hemisphereLight args={["#D8CCB8", "#14110E", 0.12 + 0.2 * P]} />
      {Array.from({ length: floors }, (_, k) => {
        const y = -ST_H * k, n = top - k;
        const num = textTex(String(n), 256, 256, "#7E7A72", "#C23A2A", 190, `st-n${n}`);
        const open = k === 1 ? doorBelow : 0;
        return (
          <group key={k}>
            {/* landing (with the well cut out) + mid landing */}
            <Bx p={[0, y - 0.1, 0.5]} s={[3.2, 0.2, 1.4]} c={CONC} />
            <Bx p={[0, y - 1.6, -2.7]} s={[3.2, 0.2, 1.4]} c={CONC} />
            <Flight x={0.85} y0={y} z0={-0.2} dir={-1} />
            <Flight x={-0.85} y0={y - 1.5} z0={-2.0} dir={1} />
            {/* iron rails both sides of the open well: sloped top rail + balusters */}
            {[1, -1].map((sd) => {
              const y0 = sd === 1 ? y : y - 1.5, slope = sd === 1 ? -0.69 : 0.69;
              return (
                <group key={sd}>
                  <Bx p={[sd * 0.17, y0 - 0.75 + 0.9, -1.1]} s={[0.035, 0.035, 2.3]} rx={slope} c={IRON} r={0.5} />
                  {Array.from({ length: 6 }, (_, i) => {
                    const z = -0.35 - i * 0.3, ty = sd === 1 ? y0 + (z + 0.2) * 0.833 : y0 - 1.5 - (z + 0.2) * 0.833;
                    return <Bx key={i} p={[sd * 0.17, ty + 0.45, z]} s={[0.018, 0.9, 0.018]} c={IRON} />;
                  })}
                </group>
              );
            })}
            {/* rail round the well at the landing */}
            <Bx p={[0, y + 0.9, -0.2]} s={[0.4, 0.035, 0.035]} c={IRON} />
            {/* bulkhead lights */}
            {[[-1.55, y + 2.2, 0.4], [1.55, y + 0.7, -2.7]].map((q, i) => (
              <group key={i}>
                <Cy p={q as V3} r={0.1} h={0.06} rz={Math.PI / 2} c="#EDE6D2" e="#FFE2B0" ei={1.6 * P * buzz} />
                <pointLight position={[q[0] * 0.8, q[1], q[2]]} intensity={1.6 * P} distance={4.5} color="#FFE0B0" />
                {P > 0.05 ? <Glow p={[q[0] * 0.93, q[1], q[2]]} s={0.9} o={0.45 * P} /> : null}
              </group>
            ))}
            {/* front wall with this storey's fire door */}
            <Bx p={[0.75, y + 1.5, 1.25]} s={[1.8, 3, 0.1]} c={CONC} />
            <Bx p={[-1.4, y + 1.5, 1.25]} s={[0.4, 3, 0.1]} c={CONC} />
            <Bx p={[-0.6, y + 2.6, 1.25]} s={[1.2, 0.8, 0.1]} c={CONC} />
            <group position={[ST_DOOR[0] - 0.5, y, 1.18]} rotation={[0, open * 1.3, 0]}>
              <Bx p={[0.5, 1.05, 0]} s={[1.0, 2.1, 0.06]} c="#5A6068" r={0.5} />
              <Bx p={[0.8, 1.0, -0.05]} s={[0.5, 0.05, 0.05]} c="#9AA0A6" />
            </group>
            {open > 0 ? <pointLight position={[ST_DOOR[0], y + 1.6, 1.8]} intensity={1.2 * open} distance={4} color="#C8D0E0" /> : null}
            {/* EXIT on every floor */}
            <Pl p={[ST_DOOR[0], y + 2.4, 1.18]} s={[0.5, 0.19]} ry={Math.PI} c="#fff" map={exit} e="#7CFF9C" ei={0.7 * exitGlow} />
            <Glow p={[ST_DOOR[0], y + 2.4, 1.05]} s={0.9} c="#7CFF9C" o={0.4 * exitGlow} />
            <pointLight position={[ST_DOOR[0], y + 2.2, 0.8]} intensity={0.9 * exitGlow} distance={4} color="#7CFF9C" />
            {/* painted floor number */}
            <Pl p={[-1.59, y + 1.5, 0.1]} s={[0.9, 0.9]} ry={Math.PI / 2} c="#fff" map={num} />
            <Bx p={[-1.59, y + 0.9, -0.6]} s={[0.01, 0.06, 2.6]} c="#B8402E" />
          </group>
        );
      })}
      {/* shaft walls */}
      <Bx p={[-1.65, 1.5 - 1.5 * floors, -1.1]} s={[0.1, 3 * floors + 3, 4.8]} c={CONC} />
      <Bx p={[1.65, 1.5 - 1.5 * floors, -1.1]} s={[0.1, 3 * floors + 3, 4.8]} c={CONC} />
      <Bx p={[0, 1.5 - 1.5 * floors, -3.45]} s={[3.4, 3 * floors + 3, 0.1]} c={CONC_D} />
      {/* bottom of the well: dark */}
      <Bx p={[0, -3 * floors - 0.1, -1]} s={[3.2, 0.2, 4.6]} c="#2A2824" />
      {children}
    </group>
  );
};
