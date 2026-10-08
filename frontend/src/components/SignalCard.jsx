import LevelBadge from "./LevelBadge.jsx";
import RingGauge from "./RingGauge.jsx";

const LIT = { LOW: 1, MEDIUM: 2, HIGH: 3 };

// One of the five reliability signals.
// highIsGood=false for Prompt Sensitivity / Missing Context, where HIGH is a warning.
export default function SignalCard({ title, icon, level, explanation, highIsGood = true }) {
  const isGood = highIsGood ? level === "HIGH" : level === "LOW";
  const isBad = highIsGood ? level === "LOW" : level === "HIGH";
  const tone = isGood ? "good" : isBad ? "bad" : "mid";

  return (
    <div className={`signal tone-${tone}`}>
      <div className="signal-head">
        <RingGauge lit={LIT[level]} icon={icon} />
        <LevelBadge level={level} tone={tone} />
      </div>
      <div className="signal-title">{title}</div>
      <p className="signal-text">{explanation}</p>
      <div className="signal-foot">{highIsGood ? "Higher is better" : "Higher means more risk"}</div>
    </div>
  );
}
