import React from "react";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Pl, Sp, rnd, textTex, useTex, type V3 } from "../kit/three";
import { Rain, Wet } from "./fx";

/** EP2 night roadside. Origin = the bottom of the ditch where you hide; the road runs along x.
 *
 *  Road (2 lanes) y=0.6, z +2.5 .. +9.5, shoulder z +1.5..+2.5. Ditch: a 1.2 m wide trough at z 0, floor y=0,
 *  banks rising to y=0.6 at z=+1.2 (road side) and z=-1.2 (field side). Field (dry rice stubble) z -1.2 .. -20,
 *  tree line at z -20..-24. Road sign (km marker + blue sign) on the shoulder at x=3, z=2.
 *  Moonlight from up/back left; no practical lights except the optional campfire in the ditch at x=-1.4. */

export const RS_DITCH: V3 = [0, 0, 0];          // crouch / lie here
export const RS_FIRE: V3 = [-1.4, 0, -0.1];     // campfire spot (the mistake)
export const RS_CAT: V3 = [0.55, 0, 0.15];      // cat curled beside you in the ditch
export const RS_ROAD: V3 = [0, 0.6, 5];
export const RS_SIGN: V3 = [3, 0.6, 2];
export const RS_TREES: V3 = [0, 0.6, -22];
export const RS_BLANKET: V3 = [-0.2, 0.01, 0.05];  // the one blanket spread in the ditch
export const RS_FAR: V3 = [14, 1.4, -40];          // the distant point of light (beyond the tree line gap)
export const RS_CAM: V3 = [2.4, 1.5, 3.0];       // 3/4 from the road shoulder down into the ditch; look at RS_LOOK
export const RS_LOOK: V3 = [-0.3, 0.3, -0.6];

export type RoadsideProps = {
  /** 1 = small campfire burning in the ditch (+ warm glow that gives you away) */ fire?: number;
  /** moonlight strength 0..1 (greenish) */ moon?: number;
  /** rain 0..1 */ rain?: number;
  /** blanket on the ditch floor */ blanket?: boolean;
  /** one distant point of light 0..1 (blinks slightly) */ farLight?: number;
  children?: React.ReactNode;
};

export const Roadside: React.FC<RoadsideProps> = ({ fire = 0, moon = 1, rain = 0, blanket = true, farLight = 0, children }) => {
  const f = useCurrentFrame();
  const sign = textTex("ค่ายปลอดภัย 12 กม.", 384, 128, "#1E6A3A", "#FFFFFF", 48, "rs-sign-camp");
  const sky = useTex(512, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#04060E"); gr.addColorStop(1, "#18203A");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + ((i * 37) % 7) / 10})`; g.fillRect((i * 151) % 512, (i * 67) % 170, 2, 2); }
  }, "rs-sky");
  const fl = fire ? 0.8 + 0.2 * Math.sin(f * 0.9) + 0.1 * Math.sin(f * 2.3) : 0;
  return (
    <group>
      <color attach="background" args={["#03040A"]} />
      <ambientLight intensity={0.05 + 0.12 * moon} color="#7AA890" />
      <hemisphereLight args={["#4A7A6A", "#0A0A08", 0.1 + 0.2 * moon]} />
      <directionalLight position={[-8, 12, -10]} intensity={0.55 * moon} color="#A8D8C0" />
      <Pl p={[0, 14, -60]} s={[200, 70]} c="#fff" map={sky} e="#fff" ei={0.9} />
      {/* moon */}
      <Sp p={[-18, 22, -55]} r={2.2} c="#F2F0E4" e="#F2F0E4" ei={1.4 * moon} />
      <Glow p={[-18, 22, -54]} s={14} c="#C8F0DA" o={0.5 * moon} />
      {/* road + shoulder */}
      <Bx p={[0, 0.3, 6]} s={[60, 0.6, 7]} c="#26282C" />
      {Array.from({ length: 12 }, (_, i) => <Bx key={i} p={[-27 + i * 5, 0.605, 6]} s={[2.2, 0.01, 0.14]} c="#C8C0A0" />)}
      <Bx p={[0, 0.3, 2]} s={[60, 0.6, 1]} c="#5A5046" />
      {/* ditch banks (sloped boxes) + floor */}
      <Bx p={[0, -0.05, 0]} s={[60, 0.1, 1.4]} c="#2E2A20" />
      <Bx p={[0, 0.3, 1.25]} s={[60, 0.12, 0.9]} rx={-0.7} c="#3A3424" />
      <Bx p={[0, 0.3, -1.25]} s={[60, 0.12, 0.9]} rx={0.7} c="#3A3424" />
      {/* a little water + reeds in the ditch */}
      <Bx p={[3, 0.005, 0]} s={[5, 0.01, 0.8]} c="#1A2230" r={0.15} />
      {Array.from({ length: 40 }, (_, i) => {
        const x = (rnd(i) - 0.5) * 16, z = (rnd(i * 2.7) - 0.5) * 2.2;
        return <Bx key={i} p={[x, 0.25, z]} s={[0.02, 0.5 + rnd(i * 5) * 0.3, 0.02]} rz={(rnd(i * 3) - 0.5) * 0.4} c="#4A5A30" />;
      })}
      {/* field */}
      <Bx p={[0, 0.55, -11]} s={[60, 0.1, 19]} c="#3A3826" />
      {Array.from({ length: 70 }, (_, i) => <Bx key={i} p={[(rnd(i * 1.3) - 0.5) * 40, 0.66, -2 - rnd(i * 2.1) * 17]} s={[0.12, 0.12, 0.12]} c="#5A5232" />)}
      {/* tree line */}
      {Array.from({ length: 26 }, (_, i) => {
        const x = -38 + i * 3 + rnd(i) * 1.5, h = 3 + rnd(i * 4) * 3, z = -21 - rnd(i * 6) * 3;
        return (
          <group key={i} position={[x, 0.6, z]}>
            <Cy p={[0, h * 0.3, 0]} r={0.15} h={h * 0.6} c="#1A1610" />
            <Sp p={[0, h * 0.7, 0]} r={1.2 + rnd(i * 8) * 0.8} c="#141C14" sc={[1, 1.2, 1]} />
          </group>
        );
      })}
      {/* grass on the shoulder edge + field edge */}
      {Array.from({ length: 60 }, (_, i) => <Bx key={`g${i}`} p={[(rnd(i * 4.4) - 0.5) * 30, 0.7, 1.4 + rnd(i * 1.1) * 0.9 - (i % 2) * 2.9]} s={[0.03, 0.22 + rnd(i) * 0.2, 0.03]} rz={(rnd(i * 6) - 0.5) * 0.6} c="#3E5A2E" />)}
      {/* blanket */}
      {blanket ? <group position={RS_BLANKET}><Bx s={[1.5, 0.03, 0.9]} ry={0.08} c="#7A3A3A" /><Bx p={[0.5, 0.03, 0.1]} s={[0.4, 0.04, 0.85]} ry={0.08} c="#6A3030" /></group> : null}
      {/* far light */}
      {farLight > 0 ? <><Sp p={RS_FAR} r={0.15} c="#FFE8B0" e="#FFE0A0" ei={3 * farLight} /><Glow p={RS_FAR} s={2.2 * (0.9 + 0.1 * Math.sin(f / 7))} c="#FFD890" o={0.7 * farLight} /></> : null}
      <Rain c={[0, 3.5, 0]} s={[14, 7, 8]} amt={rain} />
      <Wet p={[0, 0.61, 6]} s={[60, 7]} amt={rain} />
      {/* road sign + km post */}
      <group position={RS_SIGN}>
        {[-0.7, 0.7].map((x) => <Cy key={x} p={[x, 1.2, 0]} r={0.04} h={2.4} c="#8A8E94" />)}
        <Pl p={[0, 2.1, 0.03]} s={[1.8, 0.6]} c="#fff" map={sign} />
        <Bx p={[1.6, 0.35, 0]} s={[0.22, 0.7, 0.12]} c="#E8E4D8" />
        <Bx p={[1.6, 0.6, 0.065]} s={[0.22, 0.12, 0.01]} c="#C83A2A" />
      </group>
      {/* campfire (the "no fire" mistake) */}
      {fire ? (
        <group position={RS_FIRE}>
          {Array.from({ length: 6 }, (_, i) => <Sp key={i} p={[Math.cos(i) * 0.28, 0.06, Math.sin(i) * 0.28]} r={0.08} c="#4A4640" />)}
          {[0, 1.1, 2.2].map((a) => <Cy key={a} p={[0, 0.08, 0]} r={0.03} h={0.5} c="#3A2A1A" rx={Math.PI / 2} rz={a} />)}
          <Sp p={[0, 0.2 + 0.03 * Math.sin(f), 0]} r={0.12 * fl} c="#FF9A3A" e="#FF8A2A" ei={3} sc={[1, 1.8, 1]} />
          <Sp p={[0.03, 0.26, 0]} r={0.06 * fl} c="#FFE07A" e="#FFE07A" ei={3} sc={[1, 2, 1]} />
          <pointLight position={[0, 0.5, 0]} intensity={4 * fl} distance={9} color="#FF9A4A" />
          <Glow p={[0, 0.3, 0]} s={2.8} c="#FFA050" o={0.65 * fl} />
          <Glow p={[0, 0.5, 0]} s={7} c="#FF8A3A" o={0.18 * fl} />
        </group>
      ) : null}
      {children}
    </group>
  );
};

