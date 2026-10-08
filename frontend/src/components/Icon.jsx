// Tiny inline icon set (no icon library needed). Usage: <Icon name="shield" size={20} />
const PATHS = {
  shield: "M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z M9 12l2 2 4-4",
  layers: "M12 2l10 5-10 5L2 7l10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  shuffle: "M16 3h5v5 M4 20L21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5",
  link: "M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1 M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1",
  fileCheck: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 15l2 2 4-4",
  help: "M12 2a10 10 0 100 20 10 10 0 000-20z M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3 M12 17h.01",
  check: "M20 6L9 17l-5-5",
  arrowRight: "M5 12h14 M12 5l7 7-7 7",
  chevronDown: "M6 9l6 6 6-6",
  alert: "M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z M12 9v4 M12 17h.01",
  xCircle: "M12 2a10 10 0 100 20 10 10 0 000-20z M15 9l-6 6 M9 9l6 6",
  message: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  cpu: "M6 4h12v16H6z M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3",
  search: "M11 3a8 8 0 100 16 8 8 0 000-16z M21 21l-4.3-4.3",
  copy: "M8 8h12v12H8z M4 16V4h12",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  bulb: "M9 18h6 M10 22h4 M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z",
  doc: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M8 13h8 M8 17h5",
  refresh: "M3 12a9 9 0 0115-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 01-15 6.7L3 16 M3 21v-5h5",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
};

export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
