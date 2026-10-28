---
name: series-studio
description: >-
  Start any NEW video series or long clip on a new topic/setting (survival, educational, advertising, drama,
  comedy, motion graphic, infographic, news/review, or anything else). Use whenever the user asks to make a new
  series, a new show, "ทำซีรีส์ใหม่", "ทำคลิปหัวข้อใหม่", "คลิปยาว", or a new season in a different setting.
  First collects requirements in detail (the user may skip any or all questions), then picks a production line
  and produces using the series kit at D:\video content\series-kit. Not for continuing an existing series
  (use that series' RECIPE.md).
---

# Series Studio

Kit: `D:\video content\series-kit` (read `README.md` first).

## 1. Ask before anything (required, every new series)
Follow `INTAKE.md`: ask every section A–F in order with AskUserQuestion (max 4 questions per call; give the
listed options; the default as the first option marked "(ค่าเริ่มต้น)"). Ask the type-specific section E
questions for the type chosen in A1. Tell the user once at the start, in Thai, that they can answer "ข้าม" for
any question or "ข้ามทั้งหมด" to use all defaults. Never skip asking unless the user says so.
Questions and answers are in Thai.

## 2. Record and confirm
Write `<series folder>/REQUIREMENTS.md` (question, answer, source = user/default). Show a 5–8 line summary and
wait for a clear yes before writing any script.

## 3. Produce
- Pick the line in `FORMATS.md`. For Remotion/3D lines follow `reference/RECIPE.md` step by step, starting
  from `templates/film-ep02/`; for 2D/motion lines use the `onetake` or `hyperframes` skills.
- Copy `tools/*.py` into the new series folder's `tools/`.
- Write a series plan (`SERIES.md`), a bible + script per episode, a `RECIPE.md` for that series, and
  `CAPTIONS.md`.
- Apply every lesson in `FORMATS.md` ("บทเรียน"): no continuous background bed, still-QA every shot, fill lights,
  full render logs, 720p share copies for files over 30 MB, subagents only for non-render work during renders.
- Stop for user approval at the checkpoints chosen in F2 (default: script, characters, test stills).
