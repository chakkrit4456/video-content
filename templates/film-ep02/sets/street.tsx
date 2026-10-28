import React from "react";
import { Bx, Cy, Glow, Pl, Sp, rnd, textTex, type V3 } from "../kit/three";
import { Car, CAR_COLORS, Rain, Smoke, Wet } from "./fx";

/** EP2 street outside the condo. Origin = the lobby glass doors, street toward -z.
 *
 *  Lobby interior z 0..+4 (floor y=0, tiled), glass front at z=0 with two sliding doors (x -0.8..0.8).
 *  Pavement z 0..-3 (y=0.15 kerb), road z -3..-11 (y=0, asphalt, dashed centre line at z=-7),
 *  far pavement + shopfronts z -11..-14. Bus stop on the near pavement at x=+4.5, z=-2.
 *  Streetlights on the near kerb every 8 m (x -8, 0, 8) at z=-2.8. Abandoned cars on the road at angles,
 *  one burning (smoke) at x=-6. Trash scattered on the pavement. */

export const SR_DOORS: V3 = [0, 0, 0];          // glass doors (you stop here and look out)
export const SR_INSIDE: V3 = [0, 0, 1.2];        // just inside the lobby
export const SR_KERB: V3 = [0.6, 0.15, -2.4];    // on the pavement edge
export const SR_CAT: V3 = [0.55, 0, 0.9];        // cat beside you inside the doors
export const SR_BUSSTOP: V3 = [4.5, 0.15, -1.8];
export const SR_ROAD: V3 = [0, 0, -7];
export const SR_WALL: V3 = [7, 0.15, -0.5];     // walking along the building wall (pavement, wall at z=0, x 4..15)
export const SR_SEDAN: V3 = [9, 0, -3.9];       // parked sedan by the kerb, nose +x, key in the ignition; its pavement-side door = sedanDoor
export const SR_CAM: V3 = [2.4, 1.7, 3.6];       // 3/4 from inside the lobby looking out; look at SR_LOOK
export const SR_LOOK: V3 = [-0.4, 0.9, -3];

export type StreetProps = {
  /** 0 night .. 1 day */ day?: number;
  /** rain 0..1: streaks + wet sheen */ rain?: number;
  /** smoke from the burning car 0..1 */ smoke?: number;
  /** lobby doors open 0..1 */ open?: number;
  /** streetlights on (power) 0..1 */ lamps?: number;
  /** lobby glass doors smashed (cracked panes, shards on the floor) */ broken?: boolean;
  /** parked sedan driver door open 0..1 */ sedanDoor?: number;
  children?: React.ReactNode;
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const Street: React.FC<StreetProps> = ({ day = 0, rain = 0, smoke = 0, open = 0, lamps = 1, broken = false, sedanDoor = 0, children }) => {
  const bus = textTex("ป้ายรถเมล์", 256, 64, "#1E4A8A", "#FFFFFF", 40, "sr-bus");
  const lit = lamps * (1 - day);
  return (
    <group>
      <color attach="background" args={[day > 0.5 ? "#9AA4AC" : "#0B0E16"]} />
      <ambientLight intensity={mix(0.22, 0.8, day)} color={day > 0.5 ? "#E8ECEE" : "#7080A8"} />
      <hemisphereLight args={[day > 0.5 ? "#C8D0D8" : "#3A4870", "#1A1612", mix(0.2, 0.6, day)]} />
      <directionalLight position={[-6, 10, -4]} intensity={mix(0.15, 1.0, day) * (1 - 0.4 * rain)} color={day > 0.5 ? "#F4EEE0" : "#8EA0D0"} />
      {/* lobby */}
      <Bx p={[0, -0.05, 2]} s={[8, 0.1, 4]} c="#C8C0B0" />
      <Bx p={[0, 3.05, 2]} s={[8, 0.1, 4]} c="#3A342E" />
      <Bx p={[0, 1.5, 4.05]} s={[8, 3, 0.1]} c="#B8AC98" />
      <pointLight position={[0, 2.7, 2]} intensity={1.2 * lamps} distance={6} color="#FFE2B8" />
      <Bx p={[0, 2.98, 2]} s={[0.8, 0.03, 0.8]} c="#F4ECDC" e="#FFE6BE" ei={lamps} />
      {/* glass front: fixed panes + two sliding doors */}
      {[-2.4, 2.4].map((x) => <Bx key={x} p={[x, 1.5, 0]} s={[3.2, 3, 0.04]} c="#7A90A0" r={0.1} o={0.25} />)}
      {[-1, 1].map((sd) => <Bx key={sd} p={[sd * (0.4 + open * 0.8), 1.2, 0.04]} s={[0.8, 2.4, 0.03]} c="#8AA0B0" r={0.1} o={0.3} />)}
      {broken ? <>
        {Array.from({ length: 10 }, (_, i) => <Bx key={i} p={[(rnd(i * 2) - 0.5) * 1.6, 0.6 + rnd(i * 5) * 1.6, 0.06]} s={[0.006, 0.4 + rnd(i) * 0.5, 0.004]} rz={(rnd(i * 9) - 0.5) * 2.4} c="#E8F0F4" e="#E8F0F4" ei={0.3} />)}
        {Array.from({ length: 24 }, (_, i) => <Bx key={`s${i}`} p={[(rnd(i * 3) - 0.5) * 2.4, 0.005, (rnd(i * 7) - 0.4) * 1.6]} s={[0.06 + rnd(i) * 0.08, 0.004, 0.05]} ry={rnd(i * 4) * 3} c="#C8DCE6" r={0.1} />)}
      </> : null}
      {/* the building wall continues along the pavement (x 4..15), with dark windows above */}
      {[-1, 1].map((sd) => <group key={`w${sd}`}>
        <Bx p={[sd * 9.5, 4, 0.1]} s={[11, 8, 0.2]} c="#B8AC98" />
        {Array.from({ length: 8 }, (_, k) => <Bx key={k} p={[sd * (5.5 + (k % 4) * 2.6), 3.6 + Math.floor(k / 4) * 2.4, -0.01]} s={[1.2, 1.2, 0.02]} c="#1E2430" />)}
        <Bx p={[sd * 9.5, 0.6, -0.02]} s={[11, 0.08, 0.04]} c="#8A7E6A" />
      </group>)}
      {[-4, -0.8, 0.8, 4].map((x) => <Bx key={x} p={[x, 1.5, 0]} s={[0.08, 3, 0.1]} c="#2A2C30" />)}
      <Bx p={[0, 2.45, 0]} s={[8, 0.1, 0.12]} c="#2A2C30" />
      {/* pavement + kerb + road */}
      <Bx p={[0, 0.075, -1.5]} s={[30, 0.15, 3]} c="#8A847A" />
      <Bx p={[0, -0.05, -7]} s={[30, 0.1, 8]} c="#2E3034" />
      {Array.from({ length: 8 }, (_, i) => <Bx key={i} p={[-14 + i * 4, 0.005, -7]} s={[2, 0.01, 0.15]} c="#D8D0B0" />)}
      <Bx p={[0, 0.075, -12.5]} s={[30, 0.15, 3]} c="#7E786E" />
      <Wet p={[0, 0.16, -1.5]} s={[30, 3]} amt={rain} />
      <Wet p={[0, 0.01, -7]} s={[30, 8]} amt={rain} />
      {/* shopfronts across the road (shutters down) */}
      {Array.from({ length: 6 }, (_, i) => (
        <group key={i} position={[-12.5 + i * 5, 0, -14.5]}>
          <Bx p={[0, 3.5, 0]} s={[4.9, 7, 1]} c={["#8C7E6A", "#7A8088", "#9A8A70"][i % 3]} />
          <Bx p={[0, 1.3, 0.52]} s={[3.8, 2.4, 0.04]} c="#6A6E74" />
          {Array.from({ length: 6 }, (_, k) => <Bx key={k} p={[0, 0.3 + k * 0.38, 0.55]} s={[3.8, 0.02, 0.02]} c="#55585E" />)}
          {Array.from({ length: 6 }, (_, k) => <Bx key={`u${k}`} p={[-1.6 + (k % 3) * 1.6, 3.6 + Math.floor(k / 3) * 1.8, 0.52]} s={[0.9, 1.0, 0.04]} c="#1A1E26" e="#F2C878" ei={(rnd(i * 6 + k) > 0.85 ? 1 : 0) * (1 - day)} />)}
          <Bx p={[-1, 5, 0.52]} s={[1.2, 1.2, 0.04]} c="#1A1E26" e="#F2C878" ei={(i === 3 ? 1.2 : 0) * (1 - day)} />
        </group>
      ))}
      {/* streetlights on the near kerb */}
      {[-8, 0, 8].map((x) => (
        <group key={x} position={[x, 0.15, -2.8]}>
          <Cy p={[0, 2.5, 0]} r={0.07} h={5} c="#3A3D44" />
          <Bx p={[0, 5, -0.6]} s={[0.1, 0.1, 1.3]} c="#3A3D44" />
          <Bx p={[0, 4.93, -1.15]} s={[0.3, 0.06, 0.5]} c="#E8E0C8" e="#FFD9A0" ei={2 * lit} />
          {lit > 0.05 ? <><pointLight position={[0, 4.6, -1.2]} intensity={6 * lit} distance={10} color="#FFC888" /><Glow p={[0, 4.85, -1.15]} s={1.8} c="#FFC888" o={0.6 * lit} /></> : null}
        </group>
      ))}
      {/* bus stop */}
      <group position={SR_BUSSTOP}>
        <Bx p={[0, 2.4, 0]} s={[3, 0.08, 1.4]} c="#2E4A6A" />
        {[-1.4, 1.4].map((x) => <Cy key={x} p={[x, 1.2, 0.5]} r={0.04} h={2.4} c="#9AA0A6" />)}
        <Bx p={[0, 1.2, 0.68]} s={[3, 2.2, 0.03]} c="#9AB0C0" o={0.3} r={0.1} />
        <Bx p={[0, 0.45, 0.4]} s={[2.4, 0.06, 0.4]} c="#6A6E74" />
        <Pl p={[1.6, 2.1, 0]} s={[0.8, 0.2]} ry={Math.PI / 2} c="#fff" map={bus} />
      </group>
      {/* abandoned cars on the road */}
      <Car p={[-6, 0, -6]} ry={0.4} c={CAR_COLORS[1]} door={1} />
      <Car p={[-1.5, 0, -8.6]} ry={1.35} c={CAR_COLORS[3]} door2={0.8} />
      <Car p={[5, 0, -6.5]} ry={-0.25} c={CAR_COLORS[2]} door={0.6} lights={0.3 * (1 - day)} />
      <Car p={[10, 0, -9]} ry={0.1} c={CAR_COLORS[4]} />
      {/* parked sedan, key in the ignition (small glint by the wheel) */}
      <Car p={SR_SEDAN} ry={-Math.PI / 2} c={CAR_COLORS[0]} door2={sedanDoor} />
      <group position={SR_SEDAN}>
        <Cy p={[-0.45, 0.95, 0.35]} r={0.16} h={0.03} rz={Math.PI / 2 - 0.4} c="#1A1A1E" seg={16} />
        <Bx p={[-0.62, 0.8, 0.5]} s={[0.04, 0.06, 0.012]} c="#D8DCE0" e="#FFFFFF" ei={0.4} />
        <Sp p={[-0.62, 0.74, 0.5]} r={0.012} c="#C9A94A" />
      </group>
      <Smoke p={[-6, 1.2, -6]} amt={smoke} />
      {smoke > 0 ? <><pointLight position={[-6, 1.5, -6]} intensity={3 * smoke} distance={7} color="#FF8A3A" /><Glow p={[-6, 1.3, -5.6]} s={2.2} c="#FF8A3A" o={0.5 * smoke} /></> : null}
      {/* trash on the pavement + road */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = (rnd(i) - 0.5) * 18, z = -0.4 - rnd(i * 2.3) * 9, y = z > -3 ? 0.16 : 0.01;
        return i % 3 === 0
          ? <Sp key={i} p={[x, y + 0.1, z]} r={0.16} c="#1E1E22" sc={[1.2, 0.8, 1]} />
          : <Bx key={i} p={[x, y + 0.01, z]} s={[0.25, 0.02, 0.18]} ry={rnd(i * 4) * 3} c={["#E8E4D8", "#C83A2A", "#D8C060"][i % 3]} />;
      })}
      <Rain c={[0, 3, -4]} s={[16, 7, 10]} amt={rain} />
      {children}
    </group>
  );
};


