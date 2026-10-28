# RECIPE: สั่งทำ EP ซ้ำ หรือทำ EP ใหม่

ไฟล์นี้คือขั้นตอนจริงที่ใช้ผลิต EP1–EP2 (รวมวิธีแก้ปัญหาที่เจอ) ใช้คู่กับ:
- `SERIES.md`: เรื่องทั้งซีรีส์ ตัวละคร ปม
- `PRODUCTION-PROMPT.md`: สเปกงานและกฎของรูปแบบ
- `EPxx/bible.md` + `EPxx/script.md`: เรื่องและรายการช็อตของแต่ละ EP

## สั่งงานด้วยประโยคเดียว
เปิด Claude Code ที่ `D:\video content\animation` แล้วพิมพ์ เช่น
- `ทำ EP03 ตาม RECIPE.md` (บทมีแล้ว: ทำเสียง ฉาก ช็อต เรนเดอร์ มิกซ์ ปก)
- `ทำ EP02 ใหม่ v2 ตาม RECIPE.md` (ทำซ้ำจากไฟล์ที่มี แก้แล้วออกเป็น v2)
- `เขียนบท EP06 ต่อจาก SERIES.md แล้วทำตาม RECIPE.md` (เรื่องใหม่)

## เครื่องมือ (ติดตั้งแล้ว)
Node 24, ffmpeg 9, Python 3.14 + numpy, faster-whisper, edge-tts, **av 15.1** (av 19 ใช้กับ faster-whisper ไม่ได้)
Skill: `threejs-story-series`, `story-rule-script`, `code-rig-characters` (`C:\Users\chakk\.claude\skills\`)
เรียก `S=~/.claude/skills/threejs-story-series/scripts`

เครื่องมือของซีรีส์เองใน `tools/`:
- `tools/tts_lines.py`: เสียงพากย์ทีละบรรทัด + เวลาเป๊ะ (แทน tts.py + transcribe + align ที่พังกับภาษาไทย)
- `tools/sfx_pack.py`: สร้าง SFX แบบคลิปสั้น 18 เสียง ลง `vo/sfx2/`

## ขั้นตอน (ทำในโฟลเดอร์ `EPxx/project`)

### 1. สร้างโปรเจกต์
```
cd "D:\video content\animation\EPxx"
python "$S/new_episode.py" project --from "../EP<ก่อนหน้า>/project" --ep N
```
`--link-modules` ใช้ไม่ได้บน Windows ให้ทำ junction แทน:
```
cmd /c mklink /J "EPxx\project\node_modules" "EP01\project\node_modules"
```
จะได้ตัวละคร (`src/rig/cast.ts`), ฉากทั้งหมดของ EP ก่อน, `src/ui/days.tsx` (HUD วัน), `Film.tsx` เดิม

### 2. ตัวละคร/ฉากใหม่ (ถ้า bible บอกว่ามี)
- ตัวละคร: เพิ่ม `Look` ใน `src/rig/cast.ts` + ใส่ใน `CAST` แล้ว `npx remotion still src/index.ts Turn-<id> out/qa/turn-<id>.png --gl=angle`
- ฉาก: ไฟล์ใหม่ใน `src/sets/` ตามแบบ `sets/camp.tsx` (คอมเมนต์ผังพิกัดบนสุด, export ตำแหน่ง, props มี JSDoc, ไฟ+พื้นหลังของตัวเอง) เพิ่มใน `src/SetsQA.tsx` แล้วเรนเดอร์ `Set-<name>`
- **ส่งภาพให้ผู้ใช้ดูก่อนถ่าย**

### 3. เสียงพากย์ไทย (Niwat)
```
cp ../script.md script.md
export TTS_BASE="-6%"
export TTS_RATES='{"1":"-12%","51":"-18%","52":"-22%"}'   # บรรทัดกฎ/จุดพลิกช้าลง
export TTS_PITCH='{"1":"-4Hz","52":"-8Hz"}'                # เสียงต่ำลงตอนจุดพลิก
python ../../tools/tts_lines.py "$S"
echo '{"3":0.9,"52":1.2}' > vo/pauses.json                 # วินาทีที่เพิ่มหลังบรรทัด (+0.9 ก่อนขึ้นวันใหม่, +1.2 ก่อนจุดพลิก)
python "$S/splice.py"                                      # -> vo/vo_aligned.wav + src/lines.json
```
แก้คำที่อ่านผิด: เขียนคำใหม่ตามเสียงในบท ลบ `vo/lines_tmp/NNN.mp3` ของบรรทัดนั้น แล้วรันสองคำสั่งบนใหม่
ห้ามใช้ `transcribe.py`/`align.py` กับภาษาไทย (Whisper อ่านข้ามบรรทัด)

### 4. `src/episode.json`
`ep`, `ruleLabel: "EPN"`, `next: {ep, line: <hook EP ถัดไป>}`, คำสำคัญ `red` / `amb`, `coverFrame`

### 5. ช็อต `src/Film.tsx`
โครงเดียวกับ EP02 (`EP02/project/src/Film.tsx` ใช้เป็นแม่แบบ):
- helper: `Push` (กล้องดันเข้า), `front` (กล้องหน้าตัวละคร), `K` (คุณ + เป้มีแมว), `Fon`, `Z` (ซอมบี้เดิน), `walkAt`/`runAt`
- `SHOTS = { บรรทัด: [ช็อต] หรือ [ช็อต1, ช็อต2] }` ตาม Shot list ใน bible
- `DAY_START = { บรรทัด: วัน }`, `RULES = [[จากบรรทัด, ถึงบรรทัด, ข้อ, ข้อความสั้น]]`
- `DayHUD of={วันสุดท้าย}`, ProofCard บนบรรทัดที่มีตัวเลขข้อเท็จจริง
- ฉากกลางคืนข้างนอก: ใส่ไฟเติม (`FillR`/`FillC` แบบ EP02) ไม่งั้นหน้ามืด

### 6. ตรวจภาพ (บังคับ)
```
npx tsc --noEmit -p .
# เฟรมกลางของทุกช็อต
F=$(python -c "import json;L=json.load(open('src/lines.json',encoding='utf8'))['lines'];print(' '.join(str(round((L[i]['t']+L[i]['end'])/2*30)) for i in range(len(L))))")
rm -rf out/st && node stills.mjs $F
cd out && rm -rf seq && mkdir seq && i=0; for f in st/f*.png; do cp "$f" seq/$(printf %03d $i).png; i=$((i+1)); done
ffmpeg -y -v error -start_number 0 -i seq/%03d.png -vf "scale=240:-1,tile=8x4:padding=4" -fps_mode passthrough contact_%d.png
```
(`tools.py contact` ใช้ไม่ได้บน Windows: glob ของ ffmpeg)
ปัญหาที่เจอบ่อยและวิธีแก้:
| อาการ | แก้ |
|---|---|
| ภาพดำ/หน้ามืด | เพิ่ม pointLight ใกล้หน้า หรือ FillR/FillC |
| กล้องจมในผนัง/รถ | ใช้ `XX_CAM`/`XX_LOOK` ที่ฉาก export ไว้ (มุมที่ผ่าน QA แล้ว) |
| ช็อตมือ/ของเล็กเล็งไม่ได้ | ทำ prop ขยายเฉพาะช็อต (ดู `SScratch` ใน EP02) |
| ไฟฉายจากมือถือทำหน้าขาว | ลด intensity เหลือ ~0.45 |

### 7. เรนเดอร์ + เสียง + ปก
```
npx remotion render src/index.ts Film out/raw.mp4 --crf=20 --concurrency=2 --gl=angle   # ~25-40 นาที รันเบื้องหลัง
python ../../tools/sfx_pack.py                         # ครั้งเดียวต่อโปรเจกต์ -> vo/sfx2/
# mix.json: ไม่มี "bgm" (ห้ามมีเสียงพื้นหลังต่อเนื่อง), sfx เป็น one-shot ที่ line ref
python "$S/mix.py"                                     # ต้องได้ -14 LUFS ±1, peak <= -1
npx remotion still src/index.ts Cover out/cover.png --frame=600 --gl=angle
python "$S/tools.py" sheet out/epNN-v1.mp4 8
```
แม่แบบ `mix.json`: ดู `EP02/project/mix.json` (whoosh ทุกวันใหม่ `L<n>-0.35`, riser ก่อนจุดพลิก, impact ตรงจุดพลิก, boom ที่ END, rain แบบ `loop_to` เฉพาะฉากฝน)

### 8. ส่งมอบ
`out/epNN-v1.mp4`, `out/cover.png`, ร่างแคปชันโพสต์ (hook + ใบ้ + คำถาม + "(เรื่องแต่ง)" + แฮชแท็ก), รายงานจุดที่ยังไม่ดี
แก้รอบต่อไปออกเป็น `v2`, `v3` (เปลี่ยน `out` ใน mix.json)
อัปเดตตารางสถานะใน `SERIES.md`

## แบ่งงานให้ subagent ทำพร้อมกัน
ระหว่างเรนเดอร์ (ใช้เครื่องหนัก) ให้ subagent ทำงานที่ไม่ต้องเรนเดอร์: เขียนบท, สร้างไฟล์ฉาก, typecheck
ห้าม subagent เรนเดอร์หรือแตะโฟลเดอร์ของ EP ที่กำลังเรนเดอร์
