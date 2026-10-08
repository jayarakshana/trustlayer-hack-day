import { useEffect, useState } from "react";
import Brand from "../components/Brand.jsx";
import Icon from "../components/Icon.jsx";
import { analyzeQuestion } from "../services/analyzeService.js";

const STAGES = [
  "Generating equivalent questions",
  "Stress-testing AI responses",
  "Comparing responses",
  "Extracting claims",
  "Checking consistency",
  "Evaluating evidence",
  "Identifying assumptions",
];
const DETAILS = [
  "Rewording your question in several equivalent ways",
  "Collecting an independent answer for each version",
  "Checking whether the answers reach the same conclusion",
  "Pulling out the individual claims being made",
  "Looking for claims that agree or conflict",
  "Weighing how well the claims are supported",
  "Surfacing what the answers take for granted",
];
const STAGE_MS = 1100;

// Positions for the orbit nodes around the radar (7 evenly spaced points).
const CX = 200, CY = 200, RING = 150;
const CIRC = 2 * Math.PI * RING;
const orbit = (i) => {
  const a = (-90 + (i * 360) / STAGES.length) * (Math.PI / 180);
  return [CX + RING * Math.cos(a), CY + RING * Math.sin(a)];
};

export default function AnalyzingPage({ question, onDone, onFail }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let result = null;
    let animationFinished = false;

    // Move to the report only when BOTH the data and the stage animation are done.
    function maybeFinish() {
      if (!cancelled && result && animationFinished) onDone(result);
    }

    analyzeQuestion(question)
      .then((data) => {
        result = data;
        maybeFinish();
      })
      .catch((err) => {
        if (!cancelled) onFail(err.message || "Something went wrong.");
      });

    let current = 0;
    const timer = setInterval(() => {
      if (current >= STAGES.length - 1) {
        clearInterval(timer);
        animationFinished = true;
        maybeFinish();
        return;
      }
      current += 1;
      setStage(current);
    }, STAGE_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [question]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="page analyzing">
      <header className="topbar">
        <Brand />
        <span className="topbar-chip live-chip"><i /> Analysis running</span>
      </header>

      <div className="analyze-grid">
        <section className="scan glass">
          <svg className="scan-svg" viewBox="0 0 400 400" aria-hidden="true">
            <defs>
              <linearGradient id="sweepGrad" gradientUnits="userSpaceOnUse" x1="200" y1="50" x2="296" y2="85">
                <stop offset="0%" stopColor="#4f8cff" stopOpacity="0" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f8cff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {[50, 100, 150].map((r) => (
              <circle key={r} className="scan-ring" cx={CX} cy={CY} r={r} />
            ))}
            <line className="scan-cross" x1="200" y1="30" x2="200" y2="370" />
            <line className="scan-cross" x1="30" y1="200" x2="370" y2="200" />
            <g className="sweep"><path d="M200 200 L200 50 A150 150 0 0 1 296.4 85.1 Z" fill="url(#sweepGrad)" /></g>
            <circle
              className="scan-arc" cx={CX} cy={CY} r={RING}
              strokeDasharray={`${(CIRC * (stage + 1)) / STAGES.length} ${CIRC}`}
              transform="rotate(-90 200 200)"
            />
            {STAGES.map((label, i) => {
              const [x, y] = orbit(i);
              const state = i < stage ? "done" : i === stage ? "active" : "pending";
              return (
                <g key={label} className={`orbit orbit-${state}`}>
                  {state === "active" && <circle className="orbit-halo" cx={x} cy={y} r="16" />}
                  <circle className="orbit-dot" cx={x} cy={y} r="11" />
                  <text className="orbit-n" x={x} y={y + 4} textAnchor="middle">{i + 1}</text>
                </g>
              );
            })}
          </svg>
          <div className="scan-core"><Icon name="shield" size={34} /></div>
        </section>

        <section className="analyze-panel glass-strong">
          <span className="pill"><span className="pill-dot pulse" />STRESS-TEST IN PROGRESS</span>
          <h2 className="analyzing-title">Stress-testing this answer</h2>
          <p className="analyzing-question">“{question}”</p>

          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} />
          </div>
          <div className="progress-meta">Stage {stage + 1} of {STAGES.length}</div>

          <ol className="timeline">
            {STAGES.map((label, i) => {
              const state = i < stage ? "done" : i === stage ? "active" : "pending";
              return (
                <li key={label} className={`step step-${state}`}>
                  <span className="step-dot">
                    {state === "done" ? <Icon name="check" size={14} /> : state === "active" ? <span className="step-pulse" /> : null}
                  </span>
                  <span className="step-main">
                    <span className="step-label">{label}</span>
                    {state === "active" && <span className="step-detail">{DETAILS[i]}</span>}
                  </span>
                  {state === "active" && <span className="step-tag">Running</span>}
                  {state === "done" && <span className="step-tag done">Done</span>}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </main>
  );
}
