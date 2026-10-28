"""Per-line edge-tts take with exact timings -> vo/takeA.wav + vo/lines.json (run from the episode folder).
usage: python tts_lines.py <skill scripts dir> [voice]"""
import asyncio, subprocess, sys, json
from pathlib import Path
sys.path.insert(0, sys.argv[1])
from common import read_script, dump
import edge_tts

VOICE = sys.argv[2] if len(sys.argv) > 2 else "th-TH-NiwatNeural"
GAP = 0.4
import os
RATES = json.loads(os.environ.get("TTS_RATES", "{}"))  # {"line": "-15%"}
BASE = os.environ.get("TTS_BASE", "-8%")
PITCH = json.loads(os.environ.get("TTS_PITCH", "{}"))  # {"line": "-4Hz"}
lines = read_script()
tmp = Path("vo/lines_tmp"); tmp.mkdir(exist_ok=True)

async def go():
    for i, l in enumerate(lines, 1):
        out = tmp / f"{i:03d}.mp3"
        if not out.exists():
            await edge_tts.Communicate(l["th"], VOICE, rate=RATES.get(str(i), BASE), pitch=PITCH.get(str(i), "+0Hz"), proxy=os.environ.get("HTTPS_PROXY")).save(str(out))
asyncio.run(go())

def trimmed(i):
    src, dst = tmp / f"{i:03d}.mp3", tmp / f"{i:03d}.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-ar", "44100", "-ac", "1", str(dst)], check=True)
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dst)], capture_output=True, text=True).stdout)
    return dst, d

t, parts = 0.2, []
for i, l in enumerate(lines, 1):
    w, d = trimmed(i)
    l["t"], l["end"] = round(t, 2), round(t + d, 2)
    parts.append((w, d)); t += d + GAP
silence = tmp / "gap.wav"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=mono", "-t", str(GAP), str(silence)], check=True)
lead = tmp / "lead.wav"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "0.2", str(lead)], check=True)
lst = tmp / "list.txt"
with open(lst, "w", encoding="utf8") as f:
    f.write(f"file '{lead.resolve().as_posix()}'\n")
    for w, _ in parts:
        f.write(f"file '{w.resolve().as_posix()}'\nfile '{silence.resolve().as_posix()}'\n")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "pcm_s16le", "vo/takeA.wav"], check=True)
dump("vo/lines.json", {"take": "vo/takeA.wav", "lines": lines})
for i, l in enumerate(lines, 1):
    print(f"{i:2d} {l['t']:7.2f} {l['end']:7.2f} {l['th']}")
print(f"total {t:.1f}s, overlaps: 0")
