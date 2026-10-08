// Shows HIGH / MEDIUM / LOW as a pill. `tone` (good|mid|bad) controls the color.
export default function LevelBadge({ level, tone }) {
  return (
    <span className={`badge badge-${tone || level.toLowerCase()}`}>
      <span className="badge-dot" />
      {level}
    </span>
  );
}
