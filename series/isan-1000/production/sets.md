# isan-1000 — Sets

Units: metres, y up, camera usually looks toward −z. Each set = `src/sets/<name>.tsx`, exports named positions (`V3`) + a component with light knobs (0..1) and `children`. Copy the structure (export positions → props type → lights → geometry → `<Glow>` halos) from the template named. Palette: warm sodium/tungsten practicals vs cool blue night; matte materials.

**Night rule:** every night set keeps a base fill so faces read on the phone: `ambientLight ≥ 0.18` + `hemisphereLight(sky, ground, ≥ 0.25)` + one soft key `pointLight` on the face side (or a `directionalLight` 0.4). Never rely on one practical only. Check faces in the contact sheet.

---

## 1. bus-terminal.tsx — หมอชิต, 4 a.m. (EP1, EP3, EP4)
Copy from: `street.tsx` (kerb, streetlights, cars) + bus-stop shelter.
Layout:
- Platform slab x −8..8, z −1..3, y 0.15; kerb at z −1. Bay road z −1..−7 (y 0).
- Tour bus (new: Bx 2.5×3.2×11, white #F0EEE8 with blue/red stripe textTex "ร้อยเอ็ด–กรุงเทพฯ") parked along x at z −4, door at x 3.
- Platform pillars every 4 m on x (−8,−4,0,4,8) z 2.6, roof Bx 18×0.2×4 y 4.
- Taxi rank (CAR_COLORS pink/green taxis from fx.tsx `Car`) at x −6..−2, z −3.
- Signs: "หมอชิต 2", bay number "37" (textTex), departures board Bx 2×0.8 emissive green text.
Positions: `BT_ARRIVE [3,0.15,-0.6]` (step off bus) · `BT_BENCH [-1,0.15,1.6]` (sit, basket beside) · `BT_TAXI [-4,0,-2.2]` (first taxi driver) · `BT_BROKER [1.8,0.15,1.2]` (นายหน้า approaches from +x) · `BT_CHICK [-0.5,0.15,1.6]` (basket on bench).
Lights (night): ambient 0.2 #8FA0C0, hemisphere ["#3A4A70","#141210",0.3]; fluorescent tubes under roof = emissive Bx + 3 pointLight #E8F4FF 1.4 d 7; sodium on road #FFB060; bus headlights `Car lights`. Fill pointLight #FFD8B0 0.8 at [0,2,4].
Knobs: `dawn` (0 = 4 a.m. navy sky, 1 = 6 a.m. orange), `crowd` 0..1, `bus` (bool).

## 2. citybus.tsx — inside a red BMTA bus (EP1, EP2)
Copy from: `condo.tsx` (long interior corridor, ceiling light rows).
Layout: interior box x −1.25..1.25, z −6..6, floor y 0.4, ceiling y 2.6. Seats: pairs facing +z on each side (x ±0.8) every 0.85 m; aisle x 0. Windows = Pl on side walls y 1.2..2.0 with scrolling street texture (offset by frame). Grab poles Cy at x ±0.45 every 1.7 m; hand straps.
Body colour inside #E8E2D4 walls, seats #A8322E vinyl, floor #3A3A3E grooved wood planks.
Positions: `CB_SEAT [0.8,0.4,0]` (you sit by window, bag on lap) · `CB_STAND [0,0.4,-1.2]` · `CB_CONDUCTOR [0,0.4,1.8]` (conductor with the metal coin tube) · `CB_PICK [0.3,0.4,-0.8]` (the pickpocket in the crush, EP1 day 6).
Props: fare ticket roll; metal fare tube (Cy r 0.04 h 0.3 #B8BCC2); fare sign "8 บาท" (verify current fare first).
Lights: day — directionalLight from window side 1.0 + ambient 0.35; night — 2 rows ceiling tubes (emissive + 3 pointLight #F0F6FF 1.2 d 5) + fill 0.25. Sway: whole group rz = 0.01·sin(f/22).

## 3. room-daily.tsx — ห้องรายวัน, Huai Khwang (EP1-4)
Copy from: `apartment.tsx` (bed, door, desk, night window, practicals).
Layout: 3×3.5 m room, back wall z −1.75 (door at x 1.0 → corridor, เจ๊หมวย's desk at corridor end), window on left wall x −1.5 (neon sign outside). Thin mattress on floor `RD_BED [-0.8,0,0.2]`, fan (stand fan, blades spin) `RD_FAN [1.1,0,0.9]`, hook with clothes, 1 fluorescent tube.
Positions: `RD_DOOR [1.0,0,-1.75]` · `RD_SIT [-0.8,0.12,0.1]` (cross-legged on mattress) · `RD_BAG [-1.2,0,-1.2]` · `RD_CHICK [-0.3,0,0.5]` · `RD_MUAY_DESK [1.0,0,-4]` (corridor, counter + abacus).
Props: **brown envelope** (see props) inside the bag; **savings book** (EP5 reveal, appears only after opening); calendar on wall with days crossed (textTex, matches day N).
Lights: night — tube #E8F4FF 1.2 + practical lamp #FFD3A0 1.8 + window neon (pink #FF4A8A pointLight 0.6 from x −2) + ambient 0.2 + hemisphere 0.25. Knob `power`, `neon`, `fan`.

## 4. somtam-stall.tsx — ร้านส้มตำ, Pratunam (EP2-5; EP5 own cart "ส้มตำไอ้แดง")
Copy from: `market.tsx` (counters, aisle, crowd spacing).
Layout: stall under a blue tarp (Pl 4×3 at y 2.4, sag). Counter Bx 2.2×0.85×0.6 at `[0,0,-0.6]`; clay mortar (ครก, Cy r 0.13 h 0.18 #8A5A3A) + wooden pestle on counter at x −0.4; papaya bin, chili/lime bowls, plastic stools (#D83A3A, #2F7FD8) and 2 steel tables at z 1..2.5.
Positions: `ST_POUND [-0.4,0,-1.1]` (you behind counter pounding) · `ST_OWNER [0.8,0,-1.1]` · `ST_CUSTOMER [0,0,0.4]` · `ST_CHICK [-1.3,0,-1.0]` (basket under the counter) · `ST_SIGN [0,2.2,-0.3]`.
Props: menu board "ส้มตำไทย 50" (verify prices); EP5 push cart variant (`cart` prop: Bx 1.4×0.9×0.6 + 2 wheels + sign "ส้มตำไอ้แดง").
Lights: evening — bare bulbs on a string (3 Sp emissive #FFD89A + 3 pointLight 1.5 d 4) + Glow; city fill ambient 0.25 #9FB0D0 + hemisphere 0.3; day — sun directional 1.1 + bounce.

## 5. motorbike-win.tsx — วินมอเตอร์ไซค์ ปากซอย (EP2-4)
Copy from: `street.tsx` (pavement, kerb, streetlights, wall).
Layout: soi mouth; pavement z 0..2 (y 0.15), road z −0.2..−6. Win shelter (Bx frame 2×2.2×1 + roof sheet) at `[2.2,0.15,1.2]` with a vest rack + sign "วิน 47 ซอยประชาสงเคราะห์" (fictional). 3 parked motorbikes (new primitive: 2 torus wheels r 0.28, Bx body 1.6×0.35×0.25, seat Bx, handlebar Cy, headlamp Sp emissive) along x at z −0.4.
Positions: `MW_SHELTER [2.2,0.15,1.0]` · `MW_TOI [1.2,0.15,0.6]` · `MW_YOU [0.2,0.15,0.9]` · `MW_BIKE [0,0,-0.4]` (TOI's bike, rideable: rider seat at y 0.75) · `MW_CHICK [0.6,0.15,1.2]`.
Lights: night — 1 streetlight #FFB060 3.0 d 10 at [−3,5,−1] + shelter tube #E8F4FF 1.2 + 7-Eleven-style shop glow (#E8FFF0 pointLight 1.0 from x 6) + ambient 0.2 + fill key on faces #FFD8B0 0.7 at [0,1.8,3].

## 6. van-night.tsx — รถตู้กลางคืน (EP4: the broker's van; EP5 ride home)
Copy from: `highway.tsx` (road, guardrail, passing car lights) + interior box like citybus.
Layout: van interior x −0.85..0.85, z −2..2, floor y 0.5, roof y 1.9; 3 bench rows at z −1.2, 0, 1.2; driver at front z 2 (x −0.4). Windows tinted (Pl #0A0E14, opacity 0.7) with streaming street lights passing (moving emissive Sp outside, speed by frame). Exterior variant: van Bx 1.9×2×5 #E8E6E0 on highway lane.
Positions: `VN_SEAT [0.5,0.5,0]` (you, by the window) · `VN_BROKER [-0.5,0.5,1.2]` (turns back from front row) · `VN_DOOR [0.85,0.5,-0.2]` (sliding door) · `VN_CHICK [0.5,0.5,-0.3]` (basket on lap/feet).
Lights (night, must stay readable): dome light #FFE0B0 0.8 (knob `dome`) + passing light sweeps (pointLight that moves along z, #FFB060 0–2) + dashboard glow #6AA0FF 0.4 front + ambient 0.18 #5A6A90 + hemisphere 0.25. EP4 police: red/blue alternating pointLight 2.0 at 2 Hz outside (knob `police`).

## 7. village.tsx — บ้านนา โนนสวรรค์ ร้อยเอ็ด (EP5)
Copy from: `roadside.tsx` (open ground, sky dome, trees, moon) + `camp.tsx` spacing.
Layout: wooden stilt house (ใต้ถุน): 4×3 m platform y 1.6 on 9 Cy posts r 0.08, under-house bamboo bench (แคร่) at `[0,0,0.5]`; zinc roof. Rice paddies beyond z −4..−30 (Pl with green #6A9A3A / gold #C9A84A texture, bund lines); palm trees (Cy trunk + Bx fronds) at x −6, 7; dirt lane z 3; water jar (โอ่ง) by the stairs; chicken coop at x 3.
Positions: `VL_BENCH [0,0.45,0.5]` (Mae + you sit) · `VL_LANE [0,0,3.5]` (you arrive) · `VL_MAE [0.6,0,0]` · `VL_STAIRS [-1.6,0,-0.4]` · `VL_CHICK [1.2,0,1.6]` (ไอ้แดง pecking free).
Lights: golden hour — sun directionalLight #FFC880 1.3 from [10,6,−8] + sky hemisphere ["#9FC8F0","#6A5A3A",0.5]; dusk variant + 1 tungsten bulb under the house #FFD3A0 1.6 + fill 0.25.

---

## Key props (shared, `src/sets/props.tsx`)
| Prop | Build | Rule |
|---|---|---|
| **Mom's brown envelope** | Pl/Bx 0.16×0.11×0.006 kraft #A87C4E, roughness 1; flap triangle; hand-writing textTex "อย่าเปิดจนกว่าเงินหมด" (#2A2A6A ballpoint); sewn into the bag's dark lining #3A2E22 with white running stitches (8 short Bx 0.01×0.002 along 3 edges) | Seen in EVERY EP (insert when the bag opens), UNOPENED until EP5. Never moves position in the lining. |
| **Savings book** | Bx 0.09×0.13×0.008, cover #2E5AA8 (bank-blue, no real bank logo — fictional "ธนาคารออมใจ"), inner page textTex with ledger rows "100 … 1,000.00", name "บักเสือ" | Only appears in EP5 when the envelope is opened. |
| **The blue string** | torus r 0.011 tube 0.003 #2F7FD8 + 2 dangling ends on ไอ้แดง's RIGHT leg; same string reused EP5 tying the new shop sign | Always on the chicken; any close-up of the chicken must show it. |
| **Abacus** | frame Bx 0.09×0.06×0.012 #6A3E22, 4 rods Cy r 0.0015, 5 beads/rod Sp r 0.006 (#C8463E red / #1E1A18), on a cord (torus) round เจ๊หมวย's neck | Beads can move in counting shots; EP5 reveal: it was Mae's (show same abacus in a Mae flashback). |
| **Keypad phone** | Bx 0.05×0.11×0.015 #2A2C30, keypad grid, screen emissive #9FD8A0; screen textTex for calls ("แม่") and PromptPay SMS "+฿20" | Only phone the hero owns. |
| Kratip | see cast card | On the bag strap always. |
| Broker's card | Pl 0.09×0.055 textTex | EP2-4. |

## HUD money counter (DOM overlay, not in the 3D Shot)
Spec in `pipeline.md` §HUD. Diegetic echo: when money changes, show the physical notes/coins (Pl 0.15×0.07 note textures #8A6A9A for 1,000? → use generic fictional note colours, never real-banknote replicas) leaving/entering the hand on the same frame as the HUD tick.
