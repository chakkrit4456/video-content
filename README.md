# Series Kit: ชุดเครื่องมือทำซีรีส์คลิปยาว

รวมทุกอย่างที่ใช้ทำซีรีส์ "ซอมบี้บุกโลก" ไว้ใช้กับหัวข้อ/รูปแบบใหม่

## วิธีใช้
เปิด Claude Code ที่ไหนก็ได้แล้วพิมพ์ เช่น `ทำซีรีส์ใหม่ เรื่องการเงินสำหรับเด็กจบใหม่`
skill `series-studio` จะทำงานอัตโนมัติ: ถามความต้องการตาม `INTAKE.md` (ตอบ "ข้ามทั้งหมด" ได้) → เลือกสายการผลิตจาก `FORMATS.md` → ผลิตตาม `reference/RECIPE.md`

## สารบัญ
| ไฟล์/โฟลเดอร์ | คืออะไร |
|---|---|
| `INTAKE.md` | แบบสอบถาม requirement 6 หมวด พร้อมค่าเริ่มต้น |
| `FORMATS.md` | สายการผลิตแยกตามประเภท + บทเรียนที่เจอ |
| `SKILLS.md` | skill / plugin / เครื่องมือทั้งหมดที่ใช้ และติดตั้งยังไง |
| `reference/` | RECIPE, PRODUCTION-PROMPT, SERIES, CAPTIONS จากโปรเจกต์ซอมบี้ |
| `templates/` | โค้ดตอนจริงไว้ตั้งต้น + ตัวอย่าง bible/script |
| `tools/` | `tts_lines.py` (เสียงพากย์), `sfx_pack.py` (SFX) |
| `skills-used/` | สำเนา skill ที่ใช้ + zip แพ็กต้นฉบับ (สำรอง/ติดตั้งเครื่องใหม่) |
| `series-studio-skill/` | skill ตัวถามก่อนเริ่ม (ติดตั้งที่ `~/.claude/skills/series-studio`) |
