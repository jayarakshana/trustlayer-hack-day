import { useState } from "react";
import Icon from "./Icon.jsx";

// Animated expand/collapse evidence panel. Body stays mounted so it can animate.
export default function Collapsible({ title, count, icon, index, children }) {
  const [open, setOpen] = useState(false);
  return (
    <section className={`accordion ${open ? "open" : ""}`}>
      <button className="accordion-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="accordion-title">
          {index && <span className="accordion-index">{index}</span>}
          {icon && <span className="accordion-icon"><Icon name={icon} size={18} /></span>}
          <span>{title}</span>
          {count !== undefined && <span className="count">{count}</span>}
        </span>
        <span className="accordion-toggle"><Icon name="chevronDown" size={18} className="chevron" /></span>
      </button>
      <div className="accordion-body">
        <div className="accordion-inner">{children}</div>
      </div>
    </section>
  );
}
