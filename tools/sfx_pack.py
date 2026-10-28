"""Short-video SFX pack, synthesised (no samples, no licence issues) -> vo/sfx2/*.wav

  python tools/sfx_pack.py

Clean one-shots in the style common on TikTok / Reels: whoosh transitions, a deep "boom" hit, a riser,
a notification ding, a glitch stinger, plus story one-shots (car horn, cart crash, phone alarm, radio
burst, zombie groan, heartbeat, rain). No continuous noise bed: every file is a one-shot with a clean
fade, so the mix stays silent between voice lines.
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
OUT = Path("vo/sfx2")
rng = np.random.default_rng(11)


def t_(d): return np.arange(int(SR * d)) / SR
def env(n, a=0.005, r=0.2, shape=3.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(r, 1e-4) * shape / 3)
    return e
def fade(x, ms=15):
    k = int(SR * ms / 1000); x = x.copy(); x[-k:] *= np.linspace(1, 0, k); x[:32] *= np.linspace(0, 1, 32); return x
def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
def bandsweep(x, f0, f1, q=1.2):
    """resonant band-pass whose centre glides f0 -> f1 (state-variable filter)"""
    y = np.zeros_like(x); lp = bp = 0.0
    fs = np.geomspace(f0, f1, len(x))
    for i, v in enumerate(x):
        f = 2 * np.sin(np.pi * fs[i] / SR); hp = v - lp - bp / q
        bp += f * hp; lp += f * bp; y[i] = bp
    return y
def norm(x, peak=0.89): return x / (np.max(np.abs(x)) + 1e-9) * peak
def save(name, x, peak=0.89):
    OUT.mkdir(parents=True, exist_ok=True)
    x = fade(norm(x, peak))
    st = np.stack([x, x], 1)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())
    print("wrote", OUT / f"{name}.wav")


def whoosh(d=0.55, f0=300, f1=3200, rev=False):
    n = int(SR * d); x = rng.standard_normal(n)
    y = bandsweep(x, f0, f1, 1.6)
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    y = y * e
    return y[::-1] if rev else y

def boom(f=55, d=1.6):
    t = t_(d); fq = f * (1 + 1.6 * np.exp(-t * 18))
    ph = 2 * np.pi * np.cumsum(fq) / SR
    body = np.tanh(2.2 * np.sin(ph)) * np.exp(-t * 2.2)
    click = rng.standard_normal(len(t)) * np.exp(-t * 120) * 0.5
    return body + onepole_lp(click, 2500)

def impact(d=1.0):
    t = t_(d)
    return boom(70, d) * 0.8 + onepole_lp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 14) * 0.7

def riser(d=2.4):
    t = t_(d); n = len(t)
    f = np.geomspace(180, 1600, n); ph = 2 * np.pi * np.cumsum(f) / SR
    tone = (np.sin(ph) + 0.5 * np.sin(ph * 1.5)) * (t / d) ** 2
    air = bandsweep(rng.standard_normal(n), 400, 6000, 1.2) * (t / d) ** 2.5
    return tone * 0.5 + air

def ding(f=1318):
    t = t_(1.2)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (4 + 3 * k)) for k, a in ((1, 1), (2.76, 0.35), (5.4, 0.12)))
    return x

def pop():
    t = t_(0.12); f = 900 * np.exp(-t * 25) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40)

def glitch(d=0.6):
    n = int(SR * d); x = np.zeros(n)
    i = 0
    while i < n:
        L = int(SR * rng.uniform(0.015, 0.06)); f = rng.choice([220, 440, 880, 1760, 3520])
        seg = np.sign(np.sin(2 * np.pi * f * np.arange(L) / SR)) * rng.uniform(0.3, 1)
        if rng.uniform() < 0.4: seg = rng.standard_normal(L) * 0.7
        x[i:i + L] = seg[: max(0, min(L, n - i))]; i += L + int(SR * rng.uniform(0, 0.02))
    return onepole_lp(x, 6000) * np.exp(-np.linspace(0, 2, n))

def heartbeat(bpm=72, d=4.0):
    t = t_(d); x = np.zeros_like(t)
    for k in range(int(d * bpm / 60) + 1):
        for off, a in ((0, 1), (0.22, 0.7)):
            s = int(SR * (k * 60 / bpm + off))
            if s < len(t):
                L = min(int(SR * 0.25), len(t) - s); tt = np.arange(L) / SR
                x[s:s + L] += a * np.sin(2 * np.pi * (48 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 18)
    return np.tanh(2 * x)

def horn(d=2.2):
    t = t_(d)
    x = sum(np.sign(np.sin(2 * np.pi * f * t)) for f in (415, 523))
    x = onepole_lp(x, 2400) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.08)
    return x

def crash(d=1.2):
    t = t_(d); x = np.zeros_like(t)
    for k in range(9):
        s = int(SR * rng.uniform(0, 0.25)); L = len(t) - s; tt = np.arange(L) / SR
        f = rng.uniform(900, 4200)
        x[s:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(6, 14)) * rng.uniform(0.3, 1)
    x += onepole_lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 9)
    return x + 0.6 * boom(90, d) * np.exp(-t * 3)

def alarm(d=2.6):
    t = t_(d); on = (np.floor(t * 8) % 2 == 0) & (np.floor(t * 2) % 2 == 0)
    return np.sin(2 * np.pi * 2100 * t) * on * 0.8 + np.sin(2 * np.pi * 2600 * t) * on * 0.3

def radio(d=1.2):
    t = t_(d); x = rng.standard_normal(len(t))
    return bandsweep(x, 1200, 1800, 3) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t)) * np.minimum(1, (d - t) / 0.2)

def groan(d=1.8):
    t = t_(d); f = 95 + 15 * np.sin(2 * np.pi * 0.7 * t) - 20 * t / d
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(ph * k) / k for k in range(1, 9))
    x = bandsweep(x + 0.3 * rng.standard_normal(len(t)), 500, 350, 2.5) + onepole_lp(x, 700) * 0.5
    return x * np.sin(np.linspace(0, np.pi, len(t))) ** 0.7

def rain(d=6.0):
    n = int(SR * d); x = onepole_lp(rng.standard_normal(n), 5000) * 0.3
    for k in range(int(d * 90)):
        s = rng.integers(0, n - 400); L = 300
        x[s:s + L] += np.sin(2 * np.pi * rng.uniform(2000, 6000) * np.arange(L) / SR) * np.exp(-np.arange(L) / 40) * rng.uniform(0.1, 0.5)
    e = np.minimum(1, np.arange(n) / (SR * 0.8)) * np.minimum(1, (n - np.arange(n)) / (SR * 1.2))
    return x * e

def chain():
    t = t_(0.5); x = np.zeros_like(t)
    for k in range(6):
        s = int(SR * k * 0.045); L = len(t) - s; tt = np.arange(L) / SR
        x[s:] += np.sin(2 * np.pi * rng.uniform(2500, 5200) * tt) * np.exp(-tt * 45)
    return x

def drag(d=1.6):
    t = t_(d); x = bandsweep(rng.standard_normal(len(t)), 250, 600, 1.5)
    return x * (0.5 + 0.5 * np.sin(2 * np.pi * 0.9 * t) ** 2)


if __name__ == "__main__":
    save("whoosh", whoosh()); save("whoosh_rev", whoosh(rev=True)); save("swish", whoosh(0.3, 800, 6000))
    save("boom", boom()); save("impact", impact()); save("riser", riser())
    save("ding", ding()); save("pop", pop(), 0.6); save("glitch", glitch())
    save("heartbeat", heartbeat()); save("horn", horn()); save("crash", crash())
    save("alarm", alarm(), 0.7); save("radio", radio(), 0.6); save("groan", groan()); save("rain", rain(), 0.5)
    save("chain", chain(), 0.7); save("drag", drag(), 0.6)
