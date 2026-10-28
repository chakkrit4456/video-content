# isan-1000 — Production pipeline (this container)

Studio root: `/home/user/isan-studio` (ep01 starter exists; `remotion.config.ts` already sets local Chromium
`/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` + GL `swangle`). Skill scripts: `S=/home/user/video-content/series-animation3d/skills/threejs-story-series/scripts`.
Repo tools: `T=/home/user/video-content/tools` (`tts_lines.py`, `sfx_pack.py`).
All commands run from the episode folder, e.g. `cd /home/user/isan-studio/ep01`.

## Hard limits
- CPU-only box: render ≈ **4 s/frame**. A 70 s EP = 2,100 frames ≈ **2 h 20 min**; a 2.5 min EP (4,500 f) ≈ 5 h. Budget stills first.
- **Only ONE render at a time** (render, still batches, mix included). Check before starting: `pgrep -fa "remotion (render|still)"` must print nothing.
- Always render in the background with a full log; never in the foreground (tool timeout).

## 0. New episode (EP2..5)
```
cd /home/user/isan-studio
python $S/new_episode.py ep02 --from ep01 --ep 2 --link-modules ep01
cd ep02   # then edit src/episode.json (title, rule, next, keywords, coverFrame), script.md, mix.json
```
Copy cast/sets once into ep01 and keep them there (linked): `src/rig/cast.ts` (from cast-cards.md), `src/rig/pets.tsx` (+ Chicken),
`src/sets/{bus-terminal,citybus,room-daily,somtam-stall,motorbike-win,van-night,village,props}.tsx` (see sets.md; start from
`/home/user/video-content/templates/film-ep02/sets/*.tsx`).

## 1. Script
`script.md` rows: `| # | VO | Subtitle TH | Subtitle EN |` (VO phrases ≤ 7 words, numbers as words; subtitles with digits).
Day-card rows start with "วันที่ N" (drives the HUD, below). Verify every price before writing (ProofCard).

## 2. Voice (edge-tts via $HTTPS_PROXY — already patched in tts_lines.py)
```
cd /home/user/isan-studio/ep01
python /home/user/video-content/tools/tts_lines.py $S th-TH-NiwatNeural      # -> vo/takeA.wav + vo/lines.json (per-line exact timings)
#   per-line tweaks: TTS_BASE="-8%" TTS_RATES='{"7":"-15%"}' TTS_PITCH='{"7":"-4Hz"}' python ...
#   cached per line in vo/lines_tmp/NNN.mp3: delete one file to re-voice only that line
python $S/transcribe.py vo/takeA.wav --lang th        # listen to doubtful Isan words (บ่, หยัง, แซ่บ, เด้อ)
# edit vo/pauses.json {"line": extra_s}: +0.4–0.6 after punch lines, +0.8–1.0 before the twist
python $S/splice.py                                    # -> vo/vo_aligned.wav + src/lines.json (picture uses ONLY this)
```
## 3. SFX
```
python /home/user/video-content/tools/sfx_pack.py      # -> vo/sfx2/*.wav (whoosh, boom, ding, horn, …) — run from the episode folder
python $S/sound.py room .                              # room-tone bed
```
Series SFX to place in `mix.json` at line refs (`L5`, `L8+1.6`, `END`): ding on every HUD change, coin/notification on the
mystery +฿20, bus air-brake (horn as stand-in), rooster crow (synth or cut), cracked-phone filter on แม่ lines.

## 4. QA stills (cheap: ~4 s each)
```
npx tsc --noEmit -p .
npx remotion still src/index.ts Turn-aidaeng out/turn-aidaeng.png      # once per new character
node stills.mjs $(python $S/tools.py mids) > out/stills.log 2>&1
python $S/tools.py contact                                            # check out/contact.png vs qa-checklist + caption band
```
## 5. Render (background, full log, one at a time)
```
pgrep -fa "remotion (render|still)" || \
nohup npx remotion render src/index.ts Film out/raw.mp4 --crf=20 --concurrency=2 --gl=swangle \
  --log=verbose > out/render.log 2>&1 &
tail -n 3 out/render.log              # progress "Rendered N/TOTAL"; ETA ≈ (TOTAL-N)*4 s
```
(`--gl=swangle` matches remotion.config.ts; npm's `render` script says `--gl=angle` — override as above.)
Partial re-check of a motion shot: `--frames=600-690` into `out/part.mp4`, then `python $S/tools.py strip out/part.mp4 t0 t1`.

## 6. Mix, cover, deliver
```
python $S/mix.py                       # mix.json "video" = fresh out/raw.mp4; target −14 LUFS ±1, peak ≤ −1 dBFS
python $S/tools.py sheet out/ep01-v1.mp4 1
npx remotion still src/index.ts Cover out/cover.png --frame=<coverFrame>
python $S/transcribe.py out/ep01-v1.mp4 --lang th
```
Deliver: MP4, cover, caption draft with "(เรื่องแต่ง)", no emoji.

---

## HUD spec — "วันที่ N · ฿ยอด"
- DOM overlay beside `<Shot>` (new `src/ui/hud.tsx`), top-right: right 48 px, top 96 px (clear of TikTok UI), above all shots, hidden on title/end cards.
- Pill: background rgba(20,22,28,0.72), radius 18, padding 10×22. Text Kanit 600, 44 px, cream #F2EBDD: `วันที่ 7 · ฿310`
  (Thai digits off; amount with thousands comma: `฿1,000`). Dot separator #E9B84A.
- Data: `src/hud.json` `[{ "line": 3, "day": 1, "baht": 1000 }, { "line": 9, "baht": 742 }, …]` — keyed to script line numbers so re-timing follows `lines.json` (event at `T(line)`).
- Change animation (12 frames): number counts from old → new (ease-out), colour red #D9483B for a drop / green #6FBF73 for a gain, holding 20 f then back to cream; pill scale 1 → 1.08 → 1; ding SFX on the same frame. Mystery +฿20: small "+฿20" chip floats up under the pill.
- Day cards ("วันที่ N" rows): full-screen card + HUD day updates on the card's first frame.
- Continuity: opening/closing amounts must equal SERIES.md table (EP1 1,000→0→+20, EP2 20→310, EP3 310→185, EP4 185→0, EP5 0→1,020). Fail QA if not.

## Caption layout spec — bilingual, Thai primary (1080×1920)
All text inside the **1150–1500 px band** (style guide: captions own y 1230–1450; keep faces/props above ~1150 or below ~1500).
| Layer | y (top) | Style |
|---|---|---|
| Phrase caption (TH, karaoke chunk of VO) | ≈1230 | Kanit 600, ≤66 px (auto-shrink by length), cream #F2EBDD, soft shadow; red chip / amber key words |
| Subtitle TH (full line, primary) | ≈1325 | Kanit 600, 40 px, #F2F2F2, dark box rgba(20,22,28,0.74), radius 10, max-width 900 |
| Subtitle EN (under TH, same box) | ≈1385 | Kanit/Inter 500, **28 px (~70 %)**, #F2F2F2 at opacity 0.75, marginTop 6 |
Max 2 lines TH subtitle + 1–2 lines EN; if the block's bottom would pass 1500 px, shrink both subtitle sizes (min TH 34 / EN 24) — never move the phrase caption. Check Thai upper/lower vowels are not clipped.

**Code changes needed (not done yet):**
1. `$S/common.py` `read_script()` (line ~36) currently maps cell 2 → `"en"` (that is the TH subtitle). Change to
   `{"th": cells[1], "sub": cells[2] if len(cells) > 2 else "", "en": cells[3] if len(cells) > 3 else ""}` so splice.py
   writes `sub` + `en` into `src/lines.json` (check splice.py/revoice.py copy all row keys; tts_lines.py uses only `th`).
2. `src/ui/captions.tsx` (renders phrase captions + subtitle): `Chunk.sub` is currently filled from `l.en` (line 18) and
   drawn as one dark box (line 37). Change to `sub: l.sub ?? l.en, en: l.sub ? l.en : ""`, and render the EN line as a second
   `<div>` inside the same box (28 px, opacity 0.75). Keep `EP.subtitles` true in `src/episode.json`.
