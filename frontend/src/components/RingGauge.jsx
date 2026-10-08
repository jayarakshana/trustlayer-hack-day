import Icon from "./Icon.jsx";

// Three-segment ring. 1 / 2 / 3 segments lit for LOW / MEDIUM / HIGH.
const R = 34, C = 2 * Math.PI * R, GAP = 8, SEG = C / 3 - GAP;

export default function RingGauge({ lit, icon }) {
  return (
    <div className="ring">
      <svg viewBox="0 0 84 84" width="84" height="84" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            className={i < lit ? "ring-seg on" : "ring-seg"}
            cx="42" cy="42" r={R}
            strokeDasharray={`${SEG} ${C - SEG}`}
            transform={`rotate(${-90 + i * 120 + 4} 42 42)`}
          />
        ))}
      </svg>
      <span className="ring-icon"><Icon name={icon} size={24} /></span>
    </div>
  );
}
