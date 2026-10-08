// Five-axis "reliability profile". Outer edge = healthier.
// Shape only: no numbers are shown (levels HIGH/MEDIUM/LOW map to ring positions).
const CX = 240, CY = 172, R = 100, LABEL_R = 128;

function point(i, radius) {
  const angle = (-90 + i * 72) * (Math.PI / 180);
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

// axes: [{ label, health: 1|2|3 }]   (3 = healthiest)
export default function RadarChart({ axes }) {
  const poly = (radiusFor) =>
    axes.map((a, i) => point(i, radiusFor(a)).join(",")).join(" ");

  return (
    <svg className="radar" viewBox="0 0 480 344" role="img" aria-label="Reliability profile across five signals">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* rings: LOW / MEDIUM / HIGH */}
      {[1, 2, 3].map((n) => (
        <polygon key={n} className="radar-ring" points={poly(() => (R * n) / 3)} />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} className="radar-axis" x1={CX} y1={CY} x2={x} y2={y} />;
      })}

      {/* data shape */}
      <polygon className="radar-shape" points={poly((a) => (R * a.health) / 3)} fill="url(#radarFill)" />
      {axes.map((a, i) => {
        const [x, y] = point(i, (R * a.health) / 3);
        return <circle key={a.label} className={`radar-dot dot-${a.tone}`} cx={x} cy={y} r="6" />;
      })}

      {/* labels */}
      {axes.map((a, i) => {
        const [x, y] = point(i, LABEL_R);
        const anchor = Math.abs(x - CX) < 8 ? "middle" : x > CX ? "start" : "end";
        return (
          <text key={a.label} className="radar-label" x={x} y={i === 0 ? y - 4 : y + 4} textAnchor={anchor}>
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
