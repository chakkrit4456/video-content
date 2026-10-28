import React from "react";
import { Bx, Cy, Glow, Pl, rnd, useTex, type V3 } from "../kit/three";
import { Car, CAR_COLORS, Rain, Wet } from "./fx";

/** EP2 elevated highway, gridlocked. Origin = the hero car's driver door hinge area; traffic faces -z (out of town).
 *
 *  Deck x -9..9 (4 lanes, 3.5 m each, lane centres x -5.25, -1.75, 1.75, 5.25), y=0, z +20 .. -80.
 *  Concrete parapet + steel guardrail on both edges (x=±9). Deck stands on piers (top at y=0, ground at y=-9).
 *  Cars every ~6 m in each lane; the hero car (CAR_YOU) sits in lane 2 (x=-1.75) at z=0, driver door on the -x side.
 *  City skyline far behind at z +90 (camera looking back toward town sees it), moon/sky plane at z=-150. */

export const CAR_YOU: V3 = [-1.75, 0, 0];               // hero car centre
export const HW_DRIVER: V3 = [-3.0, 0, -0.4];          // where you stand after getting out (driver side)
export const HW_CAT: V3 = [-2.7, 0, 0.3];               // cat on the tarmac beside you
export const HW_SEAT: V3 = [-2.15, 0.45, -0.1];          // sitting in the driver's seat
export const HW_RAIL: V3 = [-8.6, 0, -2];              // standing at the guardrail looking down
export const HW_HONKER: V3 = [-1.75, 0, -6.2];    // the car in front (brake lights glowing, honking)
export const HW_GAP: V3 = [-8.8, 0, -12];          // gap in the guardrail: steel service stairs go down beside the bridge
export const HW_STAIRS_DOWN: V3 = [-10.4, -8.8, -18]; // foot of the service stairs (ground)
export const HW_CAM: V3 = [-5.6, 2.0, 4.2];             // 3/4 over the cars; look at HW_LOOK
export const HW_LOOK: V3 = [-2.2, 0.8, -1.5];

const LANES = [-5.25, -1.75, 1.75, 5.25];

export type HighwayProps = {
  /** 0 night .. 1 day */ day?: number;
  /** rain 0..1 */ rain?: number;
  /** head/tail lights of the jammed cars 0..1 */ headlights?: number;
  /** hero car driver door open 0..1 */ door?: number;
  /** honker brake lights 0..1 */ brake?: number;
  /** hero car colour */ heroColor?: string;
  children?: React.ReactNode;
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const Highway: React.FC<HighwayProps> = ({ day = 0, rain = 0, headlights = 0.6, door = 0, brake = 1, heroColor = "#B8BCC2", children }) => {
  const sky = useTex(512, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#0A1024"); gr.addColorStop(0.7, "#2C3050"); gr.addColorStop(1, "#5A4A50");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  }, "hw-night");
  const daySky = useTex(512, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#8EA0B4"); gr.addColorStop(1, "#D8CCB4");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  }, "hw-day");
  const D = day > 0.5;
  return (
    <group>
      <color attach="background" args={[D ? "#A8B2BC" : "#080A12"]} />
      <ambientLight intensity={mix(0.25, 0.85, day) * (1 - 0.25 * rain)} color={D ? "#EEF0F0" : "#7888B8"} />
      <hemisphereLight args={[D ? "#C8D4E0" : "#3A4878", "#1A1612", mix(0.25, 0.6, day)]} />
      <directionalLight position={[8, 14, 6]} intensity={mix(0.2, 1.1, day) * (1 - 0.4 * rain)} color={D ? "#FFF0D8" : "#9AACE0"} />
      {/* skies both ways */}
      <Pl p={[0, 20, -150]} s={[400, 120]} c="#fff" map={D ? daySky : sky} e="#fff" ei={0.85} />
      <Pl p={[0, 20, 150]} s={[400, 120]} ry={Math.PI} c="#fff" map={D ? daySky : sky} e="#fff" ei={0.85} />
      {/* deck */}
      <Bx p={[0, -0.3, -60]} s={[18, 0.6, 160]} c="#4A4C50" />
      <Wet p={[0, 0.01, -30]} s={[18, 100]} amt={rain} />
      {[-3.5, 0, 3.5].map((x) => Array.from({ length: 20 }, (_, i) => <Bx key={`${x}-${i}`} p={[x, 0.005, 18 - i * 5]} s={[0.14, 0.01, 2.4]} c="#D8D4C4" />))}
      {/* parapets + guardrails */}
      {[[1, -60, 160], [-1, 5.85, 33.3], [-1, -76.6, 126.8]].map(([sd, z, len], j) => (
        <group key={j}>
          <Bx p={[sd * 9, 0.4, z]} s={[0.4, 0.8, len]} c="#8A8680" />
          <Bx p={[sd * 8.75, 0.95, z]} s={[0.08, 0.3, len]} c="#A8ACB0" r={0.4} />
          {Array.from({ length: Math.floor(len / 3) }, (_, i) => <Bx key={i} p={[sd * 8.75, 0.7, z + len / 2 - 1 - i * 3]} s={[0.1, 0.6, 0.1]} c="#7A7E84" />)}
        </group>
      ))}
      {/* the gap: a steel service stair zig-zags down the outside of the bridge */}
      <group position={[-10.4, 0, -12]}>
        <Bx p={[0, -0.1, 0]} s={[2.4, 0.1, 3]} c="#5A5E64" />
        {Array.from({ length: 3 }, (_, k) => (
          <group key={k}>
            <Bx p={[0, -1.6 - 3 * k, -3 - (k % 2) * 0]} s={[1.2, 0.08, 6.4]} rx={0.46} c="#5A5E64" />
            <Bx p={[0.62, -1.0 - 3 * k, -3]} s={[0.04, 0.04, 6.4]} rx={0.46} c="#C8A030" />
            <Bx p={[0, -3.05 - 3 * k, -6.4 + (k % 2) * 6.4]} s={[2.4, 0.08, 1.4]} c="#5A5E64" />
          </group>
        ))}
        <Bx p={[-1.2, -4.5, -3]} s={[0.12, 9, 0.12]} c="#4A4E54" />
        <Bx p={[1.2, -4.5, -3]} s={[0.12, 9, 0.12]} c="#4A4E54" />
      </group>
      {/* hazard chevron beside the gap */}
      <Bx p={[-8.85, 0.5, -10.4]} s={[0.05, 0.6, 0.5]} c="#E8C030" e="#E8C030" ei={0.2} />
      {/* piers + ground far below */}
      {[10, -20, -50].map((z) => <Bx key={z} p={[0, -5, z]} s={[6, 9, 2]} c="#6A6660" />)}
      <Bx p={[0, -9.6, -30]} s={[200, 0.2, 200]} c={D ? "#4A5040" : "#12140F"} />
      {/* skyline far behind (toward town) */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = -70 + i * 6.5, h = 14 + rnd(i) * 30, z = 90 + rnd(i * 3) * 20;
        return (
          <group key={i} position={[x, -9, z]}>
            <Bx p={[0, h / 2, 0]} s={[5, h, 5]} c={D ? "#8A9098" : "#1C2234"} />
            {!D ? Array.from({ length: 6 }, (_, k) => <Bx key={k} p={[-1.5 + (k % 3) * 1.5, 4 + Math.floor(k / 3) * 6 + rnd(i + k) * 6, -2.52]} s={[0.8, 0.9, 0.02]} c="#F2C878" e="#F2C878" ei={rnd(i * 9 + k) > 0.6 ? 1.2 : 0} />) : null}
          </group>
        );
      })}
      {/* jammed cars: 4 lanes x 12 rows; skip the hero slot */}
      {LANES.map((x, li) => Array.from({ length: 22 }, (_, r) => {
        const z = 14 - r * 6.2 + (rnd(li * 31 + r) - 0.5) * 1.4;
        if (li === 1 && (r === 2 || r === 3)) return null; // hero + honker slots
        if (rnd(li * 7 + r * 13) > 0.92) return null;
        const c = CAR_COLORS[Math.floor(rnd(li * 11 + r * 5) * CAR_COLORS.length)];
        const open = rnd(li * 3 + r * 17) > 0.75 ? 0.6 + rnd(r) * 0.4 : 0;
        const near = Math.abs(z) < 10 && Math.abs(x - CAR_YOU[0]) < 5;
        return <Car key={`${li}-${r}`} p={[x + (rnd(li + r * 3) - 0.5) * 0.6, 0, z]} ry={(rnd(li * 5 + r) - 0.5) * 0.12} c={c} door={open} lights={headlights * (rnd(li + r * 9) > 0.3 ? 1 : 0)} halo={near} />;
      }))}
      {/* hero car */}
      <Car p={CAR_YOU} c={heroColor} door={door} lights={headlights} halo interior />
      <Car p={HW_HONKER} c={CAR_COLORS[2]} lights={headlights} brake={brake} halo />
      {brake > 0 ? <pointLight position={[HW_HONKER[0], 0.8, HW_HONKER[2] + 2.8]} intensity={1.5 * brake} distance={4} color="#FF3020" /> : null}
      {door > 0.3 ? <pointLight position={[CAR_YOU[0] - 0.3, 1.1, CAR_YOU[2] - 0.2]} intensity={0.8 * door} distance={2} color="#FFE8C0" /> : null}
      {/* overhead gantry sign + lamp posts on the median side */}
      {[-6, -36].map((z) => (
        <group key={z}>
          {[-1, 1].map((sd) => <Cy key={sd} p={[sd * 8.6, 3.4, z]} r={0.12} h={6.8} c="#6A6E74" />)}
          <Bx p={[0, 6.6, z]} s={[17.4, 0.3, 0.3]} c="#6A6E74" />
          <Bx p={[-4, 5.6, z]} s={[5, 1.6, 0.1]} c="#1E6A3A" />
          <Bx p={[-4, 5.6, z + 0.06]} s={[4.6, 0.12, 0.01]} c="#F0F0E8" />
        </group>
      ))}
      {[12, -12, -30, -48].map((z) => (
        <group key={z}>
          <Cy p={[8.7, 4, z]} r={0.08} h={8} c="#5A5E64" />
          <Bx p={[7.8, 7.95, z]} s={[1.8, 0.1, 0.12]} c="#5A5E64" />
          <Bx p={[7.0, 7.88, z]} s={[0.5, 0.06, 0.25]} c="#E8E0C8" e="#FFC888" ei={(1 - day) * 1.6} />
          {day < 0.5 ? <Glow p={[7.0, 7.8, z]} s={2} c="#FFC888" o={0.5} /> : null}
          {day < 0.5 && Math.abs(z) < 20 ? <pointLight position={[7.0, 7.5, z]} intensity={5} distance={14} color="#FFC888" /> : null}
        </group>
      ))}
      <Rain c={[CAR_YOU[0], 3, -2]} s={[14, 7, 16]} amt={rain} n={200} />
      {children}
    </group>
  );
};


