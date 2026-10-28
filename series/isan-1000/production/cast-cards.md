# isan-1000 — Cast cards (rig Look fields)

Source: `../SERIES.md`. Rig: `templates/film-ep02/char.tsx` (`Look`), pets `pets.tsx`.
Rule: Looks live ONLY in `src/rig/cast.ts`; never edit a character inside a shot.

## Series figure (whole cast)
`ISAN_BUILD = { leg 1.32, arm 1.30, torso 1.10, girth 0.84, limb 0.74, neck 1.5 }`, `headS 0.98` (slightly stockier than SLIM — farm kids, street workers). Face: `"dots"` for everyone (series look). Matte hair (`hairR 0.8`) except เจ๊หมวย.

---

## 1. บักเสือ ("เจ้า", 18) — protagonist
```
Role: you · Age: 18, height 0.88 · Figure: ISAN_BUILD
Silhouette: green school-sports tee + red check pha-khao-ma round the waist + kratip on the bag
Palette: skin #C99068 / hair #1A1614 / top #2E8B4E (trim #F2F0E6) / pants #2F3C55 / shoes #E6E2D8 sole #B8B2A6 / accent #B8282E
Hair: short, matte · Outfit: jersey (school sports-colour tee, white collar trim) · Face: dots
Never-change (every shot, EP1-5): 1) green jersey with white trim  2) pha-khao-ma red/white check tied at the waist, knot on the LEFT hip
Props: canvas shoulder bag (khaki #8C7A55) on the RIGHT shoulder, kratip (sticky-rice basket, #C9A86A woven) hanging from the bag strap; keypad phone in left pocket
Default face: calm-worried (browUp 0.4) · Can die: no
```
```ts
export const SUA: Look = { skin: "#C99068", hair: "short", hairC: "#1A1614", hairR: 0.8, iris: "#2A211C", eyeW: 1, eyeH: 1,
  outfit: "jersey", top: "#2E8B4E", trim: "#F2F0E6", pants: "#2F3C55", shoes: "#E6E2D8", sole: "#B8B2A6",
  brow: "#1E1A18", build: ISAN_BUILD, headS: 0.98, height: 0.88 };
```
New rig parts needed (add to `Look` + char.tsx, like EP2's `bottle`/`hood`):
- `sash?: string` — pha-khao-ma: torus/flattened cylinder r≈girth+0.01 at hip height, CanvasTexture check (red #B8282E / white #F2EEE4 / thin blue #2C4A8A lines, 8 px squares), knot = 2 Sp(0.03) + 2 hanging Bx(0.05×0.12×0.01) on left hip.
- `shoulderBag?: string` — Bx 0.26×0.2×0.07 at right hip, strap = thin Cy across the chest. Bag LINING is dark #3A2E22: the brown envelope (see sets.md props) is sewn inside — only visible in bag-open inserts.
- `kratip?: boolean` — Cy r 0.045 h 0.09 (#C9A86A, roughness 1) + lid Cy r 0.048 h 0.025 + Bx strap loop, hung from the bag strap.
Costume variants (same never-change details): `SUA_APRON = { ...SUA, apron: "#E9E4D8" }` for somtam-stall (EP2-5); EP5 village same Look.

## 2. ไอ้แดง — red bantam rooster (sidekick, NEVER dies)
The rig has no bird. Build `Chicken` in `src/rig/pets.tsx`, Cat-style: facing +z, feet at y=0, group `p/ry/s`, pose drives motion.
```
Role: sidekick, notices first · Size: ~0.32 tall (s=1), rides in a bamboo basket (ตะกร้า) or on the bag
Palette: body #B8321E · neck hackles #D9682A (gold-orange) · tail #1E2A22 (green-black sheen, metalness 0.2) · wing #8E2416
         comb + wattles #E0262E · beak #E8B848 · legs #E2B848 · eye #1A1210 with #F2C040 ring
Never-change: 1) jagged 5-point red comb  2) BLUE nylon string (#2F7FD8) tied on the RIGHT leg
```
```ts
export type ChickenPose = { walk?: number; amp?: number; peck?: number; head?: [number, number]; flap?: number; puff?: number; crow?: number; blink?: number; sit?: number };
export const AIDAENG = { body: "#B8321E", neck: "#D9682A", tail: "#1E2A22", wing: "#8E2416", comb: "#E0262E", beak: "#E8B848", leg: "#E2B848", string: "#2F7FD8" };
```
Primitive build (units at s=1; use `Bx, Cy, Sp, M` from `../kit/three`):
- Body: `Sp r 0.09 sc [0.85, 0.8, 1.15]` at y 0.17, tilted rx −0.25 (chest up). `puff` scales xz by 1+0.2·puff.
- Breast: `Sp r 0.06 c neck` at [0, 0.16, 0.07].
- Neck: `Cy r 0.03 r2 0.045 h 0.09` at [0, 0.24, 0.07] rx 0.35, colour neck (hackles); `head`/`peck` rotate a neck group (peck: rx += 0.9·sin(peck)).
- Head: `Sp r 0.038` at neck top; beak = `Cy r 0.001 r2 0.012 h 0.035` (cone) rx π/2 at z +0.04; `crow` opens a lower beak cone by 0.3 rad.
- Comb: 5 `Sp r 0.012..0.018` in a row along z on the head top (heights 0.010,0.018,0.022,0.018,0.012) — jagged.
- Wattles: 2 `Sp r 0.011 sc [0.6,1.4,0.6]` under the beak.
- Eyes: 2 `Sp r 0.007` dark on x ±0.03 with a `Cy r 0.009 h 0.002` amber ring; `blink` scales y.
- Wings: 2 `Sp r 0.07 sc [0.25, 0.6, 1.0]` on x ±0.075, c wing; `flap` rotates rz ±(0.2+1.2·flap)·sin(f·1.4).
- Tail: 4 sickle feathers = `Bx 0.012×0.13×0.03` fanned at [0, 0.24, −0.1], rx −0.6..−1.1, c tail, roughness 0.35.
- Legs: 2 `Cy r 0.008 h 0.09` at x ±0.03, swing by `walk/amp` like Cat; feet = 3 thin Bx toes. `sit` hides legs (body y −0.06).
- Blue string: `torus r 0.011 tube 0.003` on right shank + 2 loose ends `Cy r 0.002 h 0.03` hanging — ALWAYS rendered.
Add `Turn-aidaeng` QA sheet (4 views + face) before shooting. Basket: open Cy r 0.13 h 0.12, weave via canvas texture #B48A4E, two handle torus arcs.

## 3. แม่ — voice/phone only EP1-4, on screen EP5
EP1-4: never shown. Represent with: the keypad phone (Bx 0.05×0.11×0.015 #2A2C30, green-lit screen #9FD8A0 e 1.2) + caller ID "แม่" + cracked-speaker audio (mix: band-pass 400-3k Hz, light distortion). Optional OS hands only (skin #B88058).
```
EP5 card — Role: adult (mother) · height 0.86 · Figure: ISAN_BUILD, girth 0.9
Silhouette: grey-streaked bun + indigo mo-hom shirt + phasin
Palette: skin #B88058 / hair #2A2624 (streaks #8A8680) / top #2E3A5E (mo-hom indigo) / pants (phasin) #6A2C34 with #C9A050 hem / shoes #3A2E26 (sandals)
Hair: bun (new: Sp r 0.06 at back of head on top of "short") · Outfit: blouse (+skirt) · Face: dots
Never-change: 1) indigo mo-hom shirt  2) the same keypad phone in her hand (holdR "phone")
Default face: warm (browUp 0.3, mouth 0.1) · Can die: no
```
```ts
export const MAE: Look = { skin: "#B88058", hair: "short", hairC: "#2A2624", iris: "#2E2620", eyeW: 0.95, eyeH: 0.9, outfit: "blouse",
  top: "#2E3A5E", pants: "#6A2C34", shoes: "#3A2E26", brow: "#3A3430", holdR: "phone", build: { ...ISAN_BUILD, girth: 0.9 }, height: 0.86 };
```

## 4. เจ๊หมวย — day-room landlady, Huai Khwang (sharp tongue, kind heart; knew Mae)
```
Role: adult, gatekeeper → secret helper · ~50s, height 0.85 · Figure: ISAN_BUILD, girth 0.95, torso 1.05
Silhouette: pink plastic curlers + floral house dress + small abacus on a cord round the neck
Palette: skin #E0B08A / hair #1C1816 / curlers #F28AB8 / top #E9C24A (floral print dots #C8463E) / pants #3E4A5A / shoes #D86A8A (plastic slippers)
Hair: bob, glossy (hairR 0.5, hairLen 0.05) + curlers · Outfit: blouse · Face: dots
Never-change: 1) 6 pink curlers (Cy r 0.022 h 0.06, rz π/2) on top/back of head  2) mini abacus on her chest
Props: abacus (see sets.md), reading glasses pushed up (glasses: false by default; true for counting shots — keep consistent per scene), ring of room keys (keys: true)
Default face: unimpressed (browUp −0.3) · Can die: no
```
```ts
export const MUAY: Look = { skin: "#E0B08A", hair: "bob", hairC: "#1C1816", hairR: 0.5, hairLen: 0.05, iris: "#2E2620", eyeW: 0.9, eyeH: 0.8,
  outfit: "blouse", top: "#E9C24A", pants: "#3E4A5A", shoes: "#D86A8A", brow: "#1C1816", keys: true,
  build: { ...ISAN_BUILD, girth: 0.95, torso: 1.05 }, headS: 1.0, height: 0.85 };   // + curlers: "#F28AB8", abacus: true (new fields)
```
New fields: `curlers?: string`, `abacus?: boolean` (neck cord = thin torus, abacus Bx 0.09×0.06×0.012 wood #6A3E22 hung at chest).

## 5. พี่ต้อย — motorbike-taxi rider, fellow Isan (helps find work)
```
Role: friend · ~30, height 0.92 · Figure: ISAN_BUILD
Silhouette: orange win vest with big "47" on the back + half-face helmet on the elbow
Palette: skin #B57E56 / hair #141210 / vest #E8742A (number + trim #F4F2EA) under tee #3A3C42 / pants #2A2C34 / shoes #1E1E22 / helmet #F0EEE8
Hair: spiky short · Outfit: uniform (vest over tee) · Face: dots
Never-change: 1) orange vest, white "47" on BACK and small on the left chest (textTex)  2) towel round the neck #E9E4D8
Props: helmet (Sp r 0.13 half, open front) hung on left forearm or worn; motorbike (see sets.md motorbike-win)
Default face: easy grin (mouth 0.15, browUp 0.2) · Can die: no
```
```ts
export const TOI: Look = { skin: "#B57E56", hair: "spiky", hairC: "#141210", hairR: 0.8, iris: "#2A211C", eyeW: 1, eyeH: 1, outfit: "uniform",
  top: "#E8742A", trim: "#F4F2EA", pants: "#2A2C34", shoes: "#1E1E22", sole: "#0E0E0E", brow: "#141210", build: ISAN_BUILD, height: 0.92 };
// + vestNo: "47", towel: "#E9E4D8" (new fields; vest number via textTex on a Pl on the back)
```

## 6. "นายหน้า" — the broker (villain; arrested EP4)
```
Role: threat · ~40, height 0.9 · Figure: ISAN_BUILD, girth 0.9, slightly longer neck (1.6)
Silhouette: loud floral shirt + fake gold watch + closed-mouth smile
Palette: skin #D8A982 / hair #0E0C0C glossy slicked / top #1F6E8C with print #F2C04A / #E2584A flowers / pants #E8E2D4 (cream slacks) / shoes #4A2A1A (polished) / watch #D4AF37 (metalness 0.9, roughness 0.25)
Hair: short, glossy (hairR 0.45) · Outfit: shirt (floral CanvasTexture) · Face: dots
Never-change: 1) floral shirt  2) gold watch on the LEFT wrist (watchL)
Signature: smiles WITHOUT teeth — mouth always ≤ 0.05 (closed curve), never `fangs`, never open mouth even when talking (lip move by browUp/head nods instead).
Props: business card "งานต่างประเทศ เดือนละ 40,000" (Pl 0.09×0.055 textTex white/blue), phone (holdR "phone") in EP3-4
Can die: yes (story: arrested EP4 — show handcuffs/police light, no violence)
```
```ts
export const BROKER: Look = { skin: "#D8A982", hair: "short", hairC: "#0E0C0C", hairR: 0.45, iris: "#1E1814", eyeW: 0.9, eyeH: 0.7, outfit: "shirt",
  top: "#1F6E8C", pants: "#E8E2D4", shoes: "#4A2A1A", sole: "#141210", brow: "#0E0C0C", watchL: "#D4AF37",
  build: { ...ISAN_BUILD, girth: 0.9, neck: 1.6 }, height: 0.9 };   // + print: "floral" (new field)
```

## cast.ts registry
```ts
export const CAST: Record<string, Look> = { sua: SUA, suaapron: SUA_APRON, mae: MAE, muay: MUAY, toi: TOI, broker: BROKER };
// ไอ้แดง is not a Look: <Chicken p ry s pose colors={AIDAENG} />
```
Extras (crowd at bus terminal/citybus): reuse template ADULT/FRIEND/SCRUBS with recoloured tops; never in green jersey, orange vest or floral print (protect silhouettes).
