import type { Look } from "./char";

/* ─────────────────────────────────────────────────────────────────────────────
   YOUR CAST. One Look per character, written from a text character card
   (see the code-rig-characters skill: references/character-card.md).
   Keep every value here; never edit a character inside a shot, or continuity breaks.

   Fields
     skin / hairC / iris / brow / top / pants / shoes / sole / socks / trim  colours (hex)
     hair      "short" | "pony" | "messy" | "spiky" | "bob"   hairR (0.45 glossy .. 0.8 matte), hairLen (bob length)
     outfit    "tee" | "hoodie" | "shirt" | "coat" | "scrubs" | "uniform" | "blouse" | "jersey"
     face      "dots" (default: two small dark eyes) | "big" (cartoon eyes: eyeW/eyeH/irisK/iris apply)
     build     body proportions, default SLIM { leg 1.38, arm 1.32, torso 1.12, girth 0.82, limb 0.72, neck 1.6 }
               (1 = the rig's base unit). Change these + headS to find YOUR figure.
     headS     head scale (0.9-1.0 with SLIM)      height  overall scale (0.86-0.94 adult, ~0.7 child)
     extras    glasses, clip (hair clip colour), band (headband colour), backpack (colour),
               phones (headphones colour), patch, fangs, lips, holdR ("flashlight" | "phone" | "tape" | "keys")
   ───────────────────────────────────────────────────────────────────────────── */

/** the narrator's "you": dark tee, blue jeans, white sneakers, ponytail */
export const YOU: Look = { skin: "#E3B996", hair: "pony", hairC: "#1E1A18", iris: "#2A211C", eyeW: 1, eyeH: 1, outfit: "tee", top: "#2B2C31", pants: "#4D6C93", shoes: "#F1F0EC", sole: "#D6D3CC", brow: "#2A2420", height: 0.88 };

/** friend: short hair, olive hoodie, grey trousers */
export const FRIEND: Look = { skin: "#D9A67E", hair: "short", hairC: "#211C19", iris: "#2A211C", eyeW: 1, eyeH: 1, outfit: "hoodie", top: "#7C8762", pants: "#55575D", shoes: "#2A2A2E", sole: "#E4E1DA", brow: "#2A2420", height: 0.9 };

/** older neighbour: light shirt, glasses, grey hair */
export const ADULT: Look = { skin: "#D3A07A", hair: "short", hairC: "#8C8A86", iris: "#2E2620", eyeW: 0.95, eyeH: 0.9, outfit: "shirt", top: "#B9C9D6", pants: "#5B5F68", shoes: "#2A2420", sole: "#141210", glasses: true, brow: "#6A6864", height: 0.92 };

/** child: bob hair, yellow tee, shorter build and a slightly bigger head */
export const CHILD: Look = { skin: "#E6BE9C", hair: "bob", hairC: "#1C1816", iris: "#2A211C", eyeW: 1.05, eyeH: 1.05, outfit: "tee", top: "#E2B54E", pants: "#3F5677", shoes: "#E9E6DE", brow: "#2A2420", hairLen: 0.09, hairR: 0.8, headS: 1.08, height: 0.68 };

/** long dark coat, pale, narrow red eyes, fangs (a villain silhouette) */
export const COAT: Look = { skin: "#D5DFE6", hair: "bob", hairC: "#111216", iris: "#6A1016", eyeW: 1.0, eyeH: 0.5, face: "big", outfit: "coat", top: "#17181D", pants: "#17181D", shoes: "#141418", fangs: true, lips: "#6E1A22", brow: "#16161A", height: 0.95 };

/** scrubs (nurse / doctor) */
export const SCRUBS: Look = { skin: "#E2B48E", hair: "short", hairC: "#1E1A18", iris: "#2E2620", eyeW: 1, eyeH: 1, outfit: "scrubs", top: "#4E9C97", pants: "#4E9C97", shoes: "#EDEFF0", brow: "#2A2420", height: 0.9 };

/** any Look turned infected: grey-green skin, pale eyes. Add pose { blood: 1 } only if your series allows gore. */
export const infected = (L: Look): Look => ({ ...L, skin: "#9DB08E", iris: "#C9CFC0", brow: "#3A4034", dotC: "#E4E8DA", ...(L.outfit === "blouse" ? { pants: "#9DB08E" } : {}) });

/* ─── EP1 "วิธีเอาตัวรอดซอมบี้บุกโลกใน 30 วัน" (cards: EP01/cast/*.md) ─── */

/** คุณ: grey hoodie, dark jeans, red-strap watch on the left wrist (never change), messy dark hair */
export const KHUN_EP1: Look = { skin: "#E0B48F", hair: "messy", hairC: "#1C1816", hairR: 0.8, iris: "#2A211C", eyeW: 1, eyeH: 1, outfit: "hoodie", top: "#8A8D93", pants: "#33405A", shoes: "#E9E6DE", sole: "#CFCAC0", brow: "#221C18", watchL: "#B3262E", height: 0.9 };
/** EP2 คุณ: same + red scratch on the back of the left hand (next to the watch) */
export const KHUN: Look = { ...KHUN_EP1, scratchL: "#B0202A" };
/** ฝน (EP2): early 20s, long yellow raincoat + pointed hood, short black bob, right sleeve rolled up, 1.5 L bottle on a cord */
export const FON: Look = { skin: "#E2B693", hair: "bob", hairC: "#141210", hairLen: 0.06, hairR: 0.7, iris: "#2A211C", eyeW: 1, eyeH: 1, outfit: "coat", top: "#E8C030", pants: "#3A3E48", shoes: "#2A2A2E", sole: "#141414", brow: "#1E1A18", hood: "#E8C030", rollR: true, bottle: true, height: 0.86 };
/** ป้าจิต: floral-pink blouse, grey bob, bandage on the left wrist (never change) */
export const PAJIT: Look = { skin: "#D7A47F", hair: "bob", hairC: "#9A9590", hairLen: 0.07, hairR: 0.8, iris: "#2E2620", eyeW: 0.95, eyeH: 0.9, outfit: "shirt", top: "#D98A9A", pants: "#5A4A55", shoes: "#3A2E2A", brow: "#7A746E", wrapL: "#F2EEE4", height: 0.86 };
/** ป้าจิต after day 2 */
export const PAJIT_Z: Look = { ...PAJIT, skin: "#9DB08E", iris: "#C9CFC0", brow: "#3A4034", dotC: "#E4E8DA", wrapL: undefined };
/** พี่นัท: navy guard uniform, radio on the right hip + key ring on the left hip (never change) */
export const NAT: Look = { skin: "#C8946C", hair: "short", hairC: "#151210", iris: "#2A211C", eyeW: 1, eyeH: 1, outfit: "uniform", top: "#2C3A5A", pants: "#232B40", shoes: "#141414", sole: "#0E0E0E", brow: "#1A1512", radio: "#1E1E22", keys: true, height: 0.93 };
export const NAT_Z: Look = { ...NAT, skin: "#9DB08E", iris: "#C9CFC0", brow: "#3A4034", dotC: "#E4E8DA" };
/** generic zombies for the crowd */
export const ZOMBIE_A: Look = infected({ ...FRIEND, top: "#6E6A5E", pants: "#3E3C38" });
export const ZOMBIE_B: Look = infected({ ...SCRUBS, top: "#7E9C98", pants: "#7E9C98" });
export const ZOMBIE_C: Look = infected({ ...ADULT, glasses: false, top: "#8C7A68" });

/** characters shown by the Turn-<id> QA comps (4 views + face). Add every new character here. */
export const CAST: Record<string, Look> = { khun: KHUN, fon: FON, fonhood: { ...FON, hoodUp: true }, pajit: PAJIT, pajitz: PAJIT_Z, nat: NAT, natz: NAT_Z, za: ZOMBIE_A, zb: ZOMBIE_B, zc: ZOMBIE_C };

