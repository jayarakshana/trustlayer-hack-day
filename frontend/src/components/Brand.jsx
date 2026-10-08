import Icon from "./Icon.jsx";

// Logo + name, reused on every screen.
export default function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><Icon name="shield" size={22} /></span>
      <span className="brand-name">TRUST<span>LAYER</span></span>
    </div>
  );
}
