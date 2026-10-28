# Skill, plugin และเครื่องมือที่ใช้

## Skill (อยู่ที่ `C:\Users\chakk\.claude\skills\`, สำรองใน `skills-used/`)
| Skill | ใช้ทำอะไร | ติดตั้งเครื่องใหม่ |
|---|---|---|
| `threejs-story-series` | โปรเจกต์ Remotion + three.js, สคริปต์เสียง/จับเวลา/มิกซ์/QA | แตก `story-series-skill-pack-yoolaibeef.zip` แล้วคัด `skills/*` ไป `~/.claude/skills/` |
| `story-rule-script` | สูตรเขียนบทแบบกฎ + จุดพลิก + ไบเบิล | เหมือนข้างบน |
| `code-rig-characters` | ตัวละคร/สัตว์ 3D ด้วยโค้ด, Turn QA | เหมือนข้างบน |
| `onetake` | เสียง SFX palette, motion graphic/kinetic type (ใช้กับโฆษณา/infographic) | คัด `skills-used/onetake` |
| `hyperframes` (plugin) | ตัดต่อ/คอมโพสิตแบบ HTML, slideshow | ติดตั้งแล้วเป็น plugin `hyperframes:*` |
| `series-studio` | ถาม requirement ก่อนเริ่มซีรีส์ใหม่ (ทำขึ้นในโปรเจกต์นี้) | คัด `series-studio-skill/` ไป `~/.claude/skills/series-studio` |

## โปรแกรมในเครื่อง
Node 18+ (ใช้ 24), ffmpeg + ffprobe, Python 3.9+ กับ `numpy`, `edge-tts`, `faster-whisper`, `av==15.1`
```
python -m pip install numpy edge-tts faster-whisper "av>=14,<16"
```

## เครื่องมือที่ทำเอง (`tools/`)
- `tts_lines.py <skill scripts dir> [voice]`: env `TTS_BASE`, `TTS_RATES`, `TTS_PITCH` ปรับความเร็ว/ระดับเสียงรายบรรทัด → `vo/takeA.wav` + `vo/lines.json` แล้วรัน `splice.py`
- `sfx_pack.py`: สร้าง `vo/sfx2/*.wav` (whoosh, whoosh_rev, swish, boom, impact, riser, ding, pop, glitch, heartbeat, horn, crash, alarm, radio, groan, rain, chain, drag)

## เสียงพากย์ที่มี (edge-tts)
`th-TH-NiwatNeural` (ชาย, ใช้ในซอมบี้), `th-TH-PremwadeeNeural` (หญิง), Multilingual: `en-US-AndrewMultilingualNeural`, `en-US-BrianMultilingualNeural`, `en-US-AvaMultilingualNeural` (พูดไทยได้แต่มีสำเนียง)
ถ้ามีคีย์ ElevenLabs: `tts.py elevenlabs --voice-id ...` เสียงเป็นธรรมชาติกว่า
