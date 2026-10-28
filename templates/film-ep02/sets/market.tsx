import React from "react";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Pl, rnd, textTex, type V3 } from "../kit/three";

/** EP2 supermarket. Origin = the main aisle at the checkout end; aisles run toward -z.
 *
 *  Hall x -7..7, z +4 .. -14, floor y=0, ceiling y=3.6. Checkout counters along z=+2 (x -5, -2, 1), entrance x=5, z=+4.
 *  Shelf units (2 m tall, 0.6 deep, 8 m long) at x = -4.5, -1.5, 1.5, 4.5 from z -2 to -10 => aisles at x -3, 0, 3.
 *  Fluorescent tubes on the ceiling over each aisle every 3 m (z -1, -4, -7, -10). Fallen items litter the floor.
 *  Overhead aisle signs (Thai) hang at z=-1.5. */

export const MK_AISLE: V3 = [0, 0, -3];         // you in the middle aisle
export const MK_AISLE_END: V3 = [0, 0, -10];
export const MK_CHECKOUT: V3 = [-2, 0, 1.2];     // standing at the counter (customer side)
export const MK_CAT: V3 = [0.5, 0, -2.6];        // cat in the aisle beside you
export const MK_ENTRANCE: V3 = [5, 0, 3.5];
export const MK_WATER: V3 = [-3, 0, -10.6];     // last shrink-wrapped water packs (end of the left aisle, on a pallet)
export const MK_BACKDOOR: V3 = [-5, 0, -14];     // staff back door in the rear wall
export const MK_GLASSDOOR: V3 = [5, 0, 4];       // entrance glass door (stuck half open)
export const MK_CAM: V3 = [2.2, 1.9, 1.6];       // 3/4 down the middle aisle; look at MK_LOOK
export const MK_LOOK: V3 = [-0.2, 0.9, -5];

const SHELF = "#D8D4CC", FLOOR = "#C4BEB2";
const GOODS = ["#C83A2A", "#E8C040", "#3A7AC8", "#F0ECE0", "#4A9A5A", "#E88A3A", "#8A4AA0"];

export type MarketProps = {
  /** ceiling power 0..1 */ power?: number;
  /** tubes flicker 0..1 (how many/how hard) */ flicker?: number;
  /** shelf stock 0 (stripped) .. 1 (full) */ stock?: number;
  /** entrance sliding glass door open 0..1 (stuck at 0.5 by default) */ glassDoor?: number;
  /** shrink-wrapped 6-packs of water left on the pallet (0..6) */ water?: number;
  /** back door open 0..1 */ backDoor?: number;
  children?: React.ReactNode;
};

export const Market: React.FC<MarketProps> = ({ power = 1, flicker = 0, stock = 0.1, glassDoor = 0.5, water = 2, backDoor = 0, children }) => {
  const f = useCurrentFrame();
  const signs = ["น้ำดื่ม", "อาหารแห้ง", "ยา / ของใช้"].map((t, i) => textTex(t, 256, 96, "#C8302A", "#FFFFFF", 52, `mk-sign${i}`));
  const tube = (i: number) => {
    if (flicker <= 0 || rnd(i * 3.3) > flicker) return 1;
    const ph = Math.floor(f / 2 + rnd(i) * 40);
    return rnd(ph * 1.37 + i) < 0.35 ? 0.1 : rnd(ph * 0.71 + i) < 0.5 ? 0.6 : 1;
  };
  return (
    <group>
      <color attach="background" args={["#08080A"]} />
      <ambientLight intensity={0.1 + 0.35 * power} color="#E8F0F0" />
      <hemisphereLight args={["#E8F0EE", "#2A2620", 0.15 + 0.3 * power]} />
      {/* shell */}
      <Bx p={[0, -0.05, -5]} s={[14, 0.1, 18]} c={FLOOR} />
      {Array.from({ length: 9 }, (_, i) => <Bx key={i} p={[0, 0.002, 3.5 - i * 2]} s={[14, 0.004, 0.02]} c="#B0AA9E" />)}
      <Bx p={[0, 3.65, -5]} s={[14, 0.1, 18]} c="#3A3832" />
      <Bx p={[0, 1.8, -14]} s={[14, 3.6, 0.1]} c="#B8B4A8" />
      {[-7, 7].map((x) => <Bx key={x} p={[x, 1.8, -5]} s={[0.1, 3.6, 18]} c="#C0BCB0" />)}
      {/* front glass wall */}
      <Bx p={[-1.25, 1.8, 4]} s={[11.5, 3.6, 0.05]} c="#5A6A78" o={0.35} r={0.1} />
      <Bx p={[6.4, 1.8, 4]} s={[1.2, 3.6, 0.05]} c="#5A6A78" o={0.35} r={0.1} />
      <Bx p={[MK_GLASSDOOR[0], 2.5, 4]} s={[2.6, 0.12, 0.14]} c="#3A3C40" />
      {[-1, 1].map((sd) => <Bx key={sd} p={[MK_GLASSDOOR[0] + sd * (0.62 + glassDoor * 0.55), 1.2, 4.05 + sd * 0.03]} s={[1.2, 2.4, 0.03]} c="#7A90A0" o={0.35} r={0.1} />)}
      {/* back door */}
      <group position={[MK_BACKDOOR[0] - 0.5, 0, -13.93]} rotation={[0, -backDoor * 1.4, 0]}>
        <Bx p={[0.5, 1.05, 0]} s={[1.0, 2.1, 0.06]} c="#6A6E5E" r={0.5} />
        <Bx p={[0.85, 1.0, 0.05]} s={[0.12, 0.04, 0.05]} c="#9AA0A6" />
      </group>
      <Bx p={[MK_BACKDOOR[0], 2.4, -13.9]} s={[0.4, 0.15, 0.04]} c="#1E7A3E" e="#7CFF9C" ei={0.8} />
      <Glow p={[MK_BACKDOOR[0], 2.4, -13.8]} s={0.6} c="#7CFF9C" o={0.35} />
      {backDoor > 0 ? <Bx p={[MK_BACKDOOR[0], 1.05, -14.06]} s={[1, 2.1, 0.02]} c="#0A0C10" /> : null}
      {/* pallet + shrink-wrapped water 6-packs */}
      <group position={MK_WATER}>
        <Bx p={[0, 0.07, 0]} s={[1.2, 0.14, 1.0]} c="#A88A5A" />
        {Array.from({ length: Math.max(0, Math.min(6, Math.round(water))) }, (_, i) => (
          <group key={i} position={[-0.3 + (i % 2) * 0.6, 0.3 + Math.floor(i / 2) * 0.34, -0.15 + (Math.floor(i / 2) % 2) * 0.3]}>
            {Array.from({ length: 6 }, (_, k) => <Cy key={k} p={[-0.16 + (k % 3) * 0.16, 0, -0.08 + Math.floor(k / 3) * 0.16]} r={0.07} h={0.32} c="#9ACCE0" />)}
            <Bx s={[0.5, 0.33, 0.34]} c="#E8F4F8" o={0.35} r={0.15} />
            <Bx p={[0, 0.02, 0.172]} s={[0.4, 0.08, 0.004]} c="#2A6AC8" />
          </group>
        ))}
      </group>
      {/* fluorescent tubes */}
      {[-3, 0, 3].map((x, xi) => [-1, -4, -7, -10].map((z, zi) => {
        const i = xi * 4 + zi, b = power * tube(i);
        return (
          <group key={i}>
            <Bx p={[x, 3.5, z]} s={[0.18, 0.06, 1.3]} c="#F4F8F8" e="#E8FFF8" ei={1.8 * b} />
            <pointLight position={[x, 3.2, z]} intensity={1.6 * b} distance={5.5} color="#EAF6F2" />
            {b > 0.2 ? <Glow p={[x, 3.42, z]} s={1.3} c="#E0FFF4" o={0.35 * b} /> : null}
          </group>
        );
      }))}
      {/* aisle signs */}
      {[-3, 0, 3].map((x, i) => (
        <group key={x}>
          <Cy p={[x, 3.2, -1.5]} r={0.01} h={0.8} c="#6A6A6A" />
          <Pl p={[x, 2.75, -1.5]} s={[1.0, 0.38]} c="#fff" map={signs[i]} />
        </group>
      ))}
      {/* shelves + goods */}
      {[-4.5, -1.5, 1.5, 4.5].map((x, si) => (
        <group key={x} position={[x, 0, -6]}>
          <Bx p={[0, 1.0, 0]} s={[0.12, 2.0, 8]} c="#B0ACA4" />
          {[0.12, 0.6, 1.08, 1.56, 2.0].map((y) => <Bx key={y} p={[0, y, 0]} s={[0.9, 0.04, 8]} c={SHELF} />)}
          {[0.3, 0.78, 1.26, 1.74].map((y, yi) => Array.from({ length: 20 }, (_, k) => {
            const n = si * 97 + yi * 23 + k;
            if (rnd(n) > stock) return null;
            const side = k % 2 ? 1 : -1, h = 0.16 + rnd(n * 2) * 0.14;
            return <Bx key={k} p={[side * 0.24, y - 0.16 + h / 2, -3.8 + Math.floor(k / 2) * 0.8 + rnd(n * 3) * 0.3]} s={[0.22, h, 0.18 + rnd(n * 5) * 0.2]} c={GOODS[Math.floor(rnd(n * 7) * GOODS.length)]} />;
          }))}
        </group>
      ))}
      {/* fallen items in the aisles */}
      {Array.from({ length: 26 }, (_, i) => {
        const x = [-3, 0, 3][i % 3] + (rnd(i * 1.9) - 0.5) * 1.6, z = -2 - rnd(i * 4.1) * 8;
        return i % 4 === 0
          ? <Cy key={i} p={[x, 0.07, z]} r={0.07} h={0.24} rz={Math.PI / 2} c={GOODS[i % GOODS.length]} />
          : <Bx key={i} p={[x, 0.06, z]} s={[0.22, 0.12, 0.3]} ry={rnd(i * 8) * 3} rz={rnd(i) > 0.5 ? 0.3 : 0} c={GOODS[(i * 3) % GOODS.length]} />;
      })}
      {/* toppled cart */}
      <group position={[2.6, 0, -4.2]} rotation={[0, 0.6, Math.PI / 2 - 0.1]}>
        <Bx p={[0, 0.4, 0]} s={[0.55, 0.45, 0.9]} c="#9AA0A6" o={0.7} />
      </group>
      {/* checkout counters */}
      {[-5, -2, 1].map((x, i) => (
        <group key={x} position={[x, 0, 2]}>
          <Bx p={[0, 0.45, 0]} s={[0.8, 0.9, 2.2]} c="#3A4A5A" />
          <Bx p={[0, 0.92, 0]} s={[0.84, 0.04, 2.24]} c="#2A2C30" />
          <Bx p={[0.25, 1.15, 0.6]} s={[0.3, 0.25, 0.04]} c="#1A1E26" e="#7ACCE0" ei={i === 1 ? 0.6 * power : 0} />
          <Cy p={[0, 2.3, 0.6]} r={0.02} h={0.6} c="#6A6A6A" />
          <Bx p={[0, 2.0, 0.6]} s={[0.3, 0.3, 0.06]} c="#E8E4D8" e="#FFF2D0" ei={0.5 * power} />
        </group>
      ))}
      {children}
    </group>
  );
};

