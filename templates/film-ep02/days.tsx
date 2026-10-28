import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CREAM, Click, EP, INK, MUTED, PAPER, RED, SANS, useSpr } from "../kit/ui";

/** EP1 day counter. DayHUD = the chip top-right held for a whole day; DayCard = the big red day number that
 *  pops for ~1 s when a new day starts (with a click). */
export function DayHUD({ day, of = 30 }: { day: number; of?: number }) {
  return (
    <div style={{ position: "absolute", top: 92, right: 34, background: "rgba(246,242,234,0.93)", color: INK, fontFamily: SANS, fontWeight: 700, borderRadius: 12, padding: "6px 20px 10px", boxShadow: "0 6px 16px rgba(0,0,0,0.3)", fontSize: 40, fontVariantNumeric: "tabular-nums" }}>
      <span style={{ color: MUTED, fontSize: 28, fontWeight: 600 }}>วันที่ </span><span style={{ color: RED }}>{day}</span><span style={{ color: MUTED, fontSize: 30 }}> / {of}</span>
    </div>
  );
}

export function DayCard({ day, len = 34 }: { day: number; len?: number }) {
  const f = useCurrentFrame();
  const s = useSpr(0, 11);
  if (f > len) return null;
  const out = Math.max(0, (f - (len - 8)) / 8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 330, pointerEvents: "none" }}>
      <Click at={0} v={0.5} />
      <div style={{ fontFamily: SANS, textAlign: "center", opacity: Math.min(1, s * 2) * (1 - out), scale: String(0.8 + 0.2 * s) }}>
        <div style={{ fontSize: 46, fontWeight: 600, color: CREAM, textShadow: "0 3px 14px rgba(0,0,0,0.7)" }}>วันที่</div>
        <div style={{ fontSize: 230, fontWeight: 700, color: RED, lineHeight: 0.95, textShadow: "0 8px 30px rgba(0,0,0,0.55)" }}>{day}</div>
      </div>
    </AbsoluteFill>
  );
}

/** opening title over the hook */
export function TitleCard() {
  const a = useSpr(0, 13), b = useSpr(10, 12);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, fontFamily: SANS, textAlign: "center" }}>
      <Click at={0} v={0.45} />
      <div style={{ background: RED, color: "#FFF6EE", fontSize: 34, fontWeight: 700, padding: "4px 22px 8px", borderRadius: 10, opacity: Math.min(1, a * 2) }}>{EP.ruleLabel}</div>
      <div style={{ marginTop: 18, background: PAPER, color: INK, borderRadius: 16, padding: "22px 40px 30px", maxWidth: 900, boxShadow: "0 10px 26px rgba(20,12,4,0.4)", opacity: Math.min(1, b * 2), translate: `0 ${(1 - b) * -40}px` }}>
        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.2 }}>วิธีเอาตัวรอด<br />ซอมบี้บุกโลก</div>
        <div style={{ fontSize: 100, fontWeight: 700, lineHeight: 1.1, color: RED }}>ใน 30 วัน</div>
      </div>
    </AbsoluteFill>
  );
}
