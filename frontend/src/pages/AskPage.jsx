import { useState } from "react";
import { exampleQuestions } from "../mock/mockReport.js";
import Brand from "../components/Brand.jsx";
import Icon from "../components/Icon.jsx";

const PIPELINE = [
  { icon: "message", title: "Your question", desc: "The claim you want to put under test" },
  { icon: "copy", title: "Equivalent questions", desc: "Several rewordings that mean the same thing" },
  { icon: "cpu", title: "Independent AI answers", desc: "Each version is answered separately" },
  { icon: "search", title: "Reliability analysis", desc: "Claims, evidence, assumptions, contradictions" },
  { icon: "fileCheck", title: "AI Reliability Report", desc: "Clear signals and an overall assessment" },
];

export default function AskPage({ initialQuestion = "", error, onAnalyze }) {
  const [question, setQuestion] = useState(initialQuestion);
  const canSubmit = question.trim().length > 0;

  function submit() {
    if (canSubmit) onAnalyze(question.trim());
  }

  return (
    <main className="page ask">
      <header className="topbar">
        <Brand />
        <span className="topbar-chip"><Icon name="spark" size={14} /> Open-source reliability layer</span>
      </header>

      <div className="ask-grid">
        <section className="ask-left">
          <span className="pill"><span className="pill-dot" />AI RELIABILITY LAYER</span>
          <h1 className="headline">
            How much should you <span className="grad">trust</span> that AI answer?
          </h1>
          <p className="lead">
            TrustLayer stress-tests AI answers instead of blindly accepting them. Ask once and
            see how consistent, supported and context-dependent the answer really is.
          </p>

          <div className="console glass-strong">
            <div className="console-bar">
              <span className="console-dots"><i /><i /><i /></span>
              <span className="console-title">QUERY INPUT</span>
            </div>
            <label className="sr-only" htmlFor="question">Your question</label>
            <div className="console-field">
              <span className="prompt-caret">&gt;</span>
              <textarea
                id="question"
                className="question-input"
                placeholder="Paste a question you would normally ask an AI…"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                }}
                rows={2}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <div className="ask-actions">
              <span className="hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> to analyze</span>
              <button className="primary-btn" onClick={submit} disabled={!canSubmit}>
                Analyze answer <Icon name="arrowRight" size={20} />
              </button>
            </div>
          </div>

          <div className="examples">
            <span className="section-label">Try an example</span>
            <div className="example-list">
              {exampleQuestions.map((q, i) => (
                <button key={q} className="example" onClick={() => setQuestion(q)}>
                  <span className="example-n">0{i + 1}</span>
                  <span className="example-text">{q}</span>
                  <Icon name="arrowRight" size={18} className="example-arrow" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="pipeline-card glass">
          <div className="pipeline-head">
            <span className="section-label">How TrustLayer works</span>
            <span className="live"><i /> Stress-test pipeline</span>
          </div>
          <ol className="pipeline">
            <span className="pipe-pulse" aria-hidden="true" />
            {PIPELINE.map((step, i) => (
              <li className="pipe-item" key={step.title} style={{ "--i": i }}>
                <span className="pipe-node"><Icon name={step.icon} size={22} /></span>
                <div className="pipe-text">
                  <span className="pipe-n">STEP 0{i + 1}</span>
                  <strong>{step.title}</strong>
                  <span>{step.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <p className="footnote">
        TrustLayer does not claim absolute truth. It helps you understand how much scrutiny an AI answer deserves.
      </p>
    </main>
  );
}
