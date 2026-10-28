# Cast cards: ถ้าซอมบี้บุกหอโหวด 101 ร้อยเอ็ด
Series figure: `ISAN_BUILD` (leg 1.32, arm 1.3, torso 1.1, girth 0.84, limb 0.74, neck 1.5), headS 0.98, face dots.
Code: `src/rig/cast.ts` (people), `src/rig/pets.tsx` (Dog), `src/rig/poses.ts` (motion). QA: `Turn-<id>`.

## คุณ (id `khun`, `KHUN`)
Role: you (guide intern) · adult 0.87 · Silhouette: ponytail + navy polo with yellow collar + lanyard badge
Palette: skin #D9A57C / hair #1A1614 / polo #1F2E5C, collar #F2C230 / khaki #C2AE84 / white sneakers / lanyard #2F6FD0
Hair: pony, matte · Outfit: `polo` (new) · Never-change: yellow collar, lanyard name badge
Prop: the wot, passed as a node: `<Char L={KHUN} handR={<Wot/>} />` (or `handL`). Slot origin = hand centre, -y = away from the elbow.
Default face: calm (browUp 0.3) · Can die: no

## ลุงชาญ (id `chan`, `CHAN`; turned: `chanz`, `CHAN_Z`)
Role: the threat inside (lift tech, 55) · 0.89, girth 0.92 · Silhouette: navy cap + grey short-sleeve work shirt + tool belt
Palette: skin #B98058 / grey hair #4A4744 / shirt #8C9096 / trousers #3E434C / cap #25355E / plaster #E3C9A2
Never-change: fresh beige PLASTER on the LEFT wrist (`plasterL`, wrap + pad, seen front and side); radio on the RIGHT hip (`radio`)
Extras: name patch on the left chest, key ring on the left hip (`keyRing`); lift key in the hand = `holdR: "keys"`; yanked radio = pose `radioOff: true`
Zombie variant: `rotL` 0..1 grey-green spreads from the wrist up the forearm with veins (animate `pose.rotL`), `dullEyes`, motion `shambleWalk(dist)` / `zombieIdle(f)`
Default face: tired (browUp 0.1) · Can die: n/a

## ป้าเพ็ญ (id `pen`, `PEN`)
Role: meatball vendor by the lake (50s) · 0.85 · Silhouette: wide straw hat + red flower blouse + white apron
Palette: skin #C48A60 / hair #22201E / blouse #C8463E with yellow and white flowers / apron #F2EFE8 / hat #D9C08A with a red band
Never-change: straw sun hat, apron · Can die: open

## Tourists ×12 = 6 looks (`TOURISTS`, ids `tourA`..`tourF`)
A orange tee, white cap, green backpack, phone · B cream blouse, blue skirt, bob, tan tote · C green shirt, glasses, sun hat, shoulder bag ·
D lilac hoodie, messy auburn hair, headphones · E blue tee, spiky hair, yellow backpack · F pink blouse, bun, glasses, blue tote.
Use each twice with different `seed`, `ry`, walk phase and `holdR`.

## Zombie crowd (`ZOMBIES`, ids `zombA`..`zombC`)
`zed(L)` = infected skin, torn + dirty clothes (`torn`), dull eyes, no accessories. A brown tee · B grey shirt, messy hair · C ex-vendor in red with a dirty apron.
Motion: `shambleWalk(dist, ph0, amp)` with a different ph0 per zombie (SHAMBLE_STRIDE 0.62 m × build.leg/1.38).

## ข้าวจี่ (Dog, `Turn-khaojee`)
Thai ridgeback-style street dog, brown #A8683A, dark RIDGE stripe on the back (never-change), erect ears, black nose, tail curled over the back.
Poses (all continuous, tween them with `ease`): `walk: dogWalkPhase(dist)` + `amp` · `sit` · `lie` · `bark` (`barkAt(f, f0)` gives jaw + bob) · `hackles` (ridge rises, tail goes stiff) · `carried` (with `CARRY_DOG` on the carrier, dog at `carryDogOffset(L.height)`).
Idle is automatic: breathing, blinks, ear twitch, slow tail wag. Must not die.
