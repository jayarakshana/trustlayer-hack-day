import Brand from "../components/Brand.jsx";
import Icon from "../components/Icon.jsx";
import SignalCard from "../components/SignalCard.jsx";
import Collapsible from "../components/Collapsible.jsx";
import AgreementMeter from "../components/AgreementMeter.jsx";
import RadarChart from "../components/RadarChart.jsx";

const VERDICT_TONE = { "RELIABLE": "good", "USE WITH CAUTION": "mid", "UNRELIABLE": "bad" };
const VERDICT_ICON = { "RELIABLE": "shield", "USE WITH CAUTION": "alert", "UNRELIABLE": "xCircle" };
const MARKER_POS = { "UNRELIABLE": "16%", "USE WITH CAUTION": "50%", "RELIABLE": "84%" };

// Turn a signal into 1..3 "health" for the radar shape (risk signals are inverted).
function health(level, highIsGood) {
  const n = { LOW: 1, MEDIUM: 2, HIGH: 3 }[level];
  return highIsGood ? n : 4 - n;
}
const toneOf = (h) => (h === 3 ? "good" : h === 1 ? "bad" : "mid");

export default function ReportPage({ report, onReset }) {
  const { signals } = report;
  const tone = VERDICT_TONE[report.verdict] || "mid";

  const radarAxes = [
    ["Answer Stability", signals.answer_stability, true],
    ["Prompt Sensitivity", signals.prompt_sensitivity, false],
    ["Claim Consistency", signals.claim_consistency, true],
    ["Evidence Support", signals.evidence_support, true],
    ["Missing Context", signals.missing_context, false],
  ].map(([label, s, good]) => {
    const h = health(s.level, good);
    return { label, health: h, tone: toneOf(h) };
  });

  return (
    <main className="page report">
      <header className="topbar">
        <Brand />
        <button className="ghost-btn" onClick={onReset}>
          <Icon name="refresh" size={16} /> Ask another question
        </button>
      </header>

      <section className="report-head">
        <span className="pill"><span className="pill-dot" />AI RELIABILITY REPORT</span>
        <h1 className="report-question">“{report.question}”</h1>
      </section>

      <section className="hero-grid">
        <div className={`verdict tone-${tone}`}>
          <div className="section-label">Overall assessment</div>
          <div className="verdict-main">
            <span className="verdict-icon"><Icon name={VERDICT_ICON[report.verdict] || "alert"} size={44} /></span>
            <div className="verdict-value">{report.verdict}</div>
          </div>
          <p className="verdict-summary">{report.verdict_summary}</p>

          <div className="spectrum" aria-label="Assessment scale">
            <div className="spectrum-bar">
              <span className="spectrum-marker" style={{ left: MARKER_POS[report.verdict] || "50%" }} />
            </div>
            <div className="spectrum-labels">
              <span className={report.verdict === "UNRELIABLE" ? "on" : ""}>UNRELIABLE</span>
              <span className={report.verdict === "USE WITH CAUTION" ? "on" : ""}>USE WITH CAUTION</span>
              <span className={report.verdict === "RELIABLE" ? "on" : ""}>RELIABLE</span>
            </div>
          </div>
        </div>

        <div className="profile glass">
          <div className="section-label">Reliability profile</div>
          <RadarChart axes={radarAxes} />
          <p className="profile-note">Further from the center is more reliable. Risk signals are inverted.</p>
        </div>
      </section>

      <section className="why glass">
        <div className="why-head">
          <div className="section-label">Why this verdict?</div>
          <span className="why-note">Based on the five signals below</span>
        </div>
        <ul className="why-list">
          {report.why.map((reason, i) => (
            <li key={reason}>
              <span className="why-n">0{i + 1}</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="section-label spaced">Reliability signals</div>
      <section className="signals">
        <SignalCard title="Answer Stability" icon="layers" {...signals.answer_stability} />
        <SignalCard title="Prompt Sensitivity" icon="shuffle" {...signals.prompt_sensitivity} highIsGood={false} />
        <SignalCard title="Claim Consistency" icon="link" {...signals.claim_consistency} />
        <SignalCard title="Evidence Support" icon="fileCheck" {...signals.evidence_support} />
        <SignalCard title="Missing Context" icon="help" {...signals.missing_context} highIsGood={false} />
      </section>

      <div className="section-label spaced">Agreement across answers</div>
      <AgreementMeter answers={report.answers} summary={report.agreement.summary} />

      <div className="section-label spaced">Evidence and analysis</div>
      <div className="details">
        <Collapsible index="01" title="Equivalent Questions" icon="copy" count={report.equivalent_questions.length}>
          <ol className="plain-list">
            {report.equivalent_questions.map((q) => <li key={q}>{q}</li>)}
          </ol>
        </Collapsible>

        <Collapsible index="02" title="Answers" icon="message" count={report.answers.length}>
          {report.answers.map((a, i) => (
            <div className="item" key={a.question}>
              <div className="item-head">
                <strong>Answer {i + 1}</strong>
                <span className="tag">{a.conclusion}</span>
              </div>
              <div className="item-sub">{a.question}</div>
              <p>{a.text}</p>
            </div>
          ))}
        </Collapsible>

        <Collapsible index="03" title="Claims" icon="list" count={report.claims.length}>
          {report.claims.map((c) => (
            <div className="item" key={c.text}>
              <div>{c.text}</div>
              <div className="item-sub">
                {c.appears_in} · <span className={`status status-${c.status.toLowerCase().replace(" ", "-")}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </Collapsible>

        <Collapsible index="04" title="Assumptions" icon="bulb" count={report.assumptions.length}>
          <ul className="plain-list">
            {report.assumptions.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </Collapsible>

        <Collapsible index="05" title="Contradictions" icon="alert" count={report.contradictions.length}>
          {report.contradictions.map((c) => (
            <div className="item" key={c.between}>
              <strong>{c.between}</strong>
              <p>{c.detail}</p>
            </div>
          ))}
        </Collapsible>

        <Collapsible index="06" title="Uncertainty" icon="help" count={report.uncertainty.length}>
          <ul className="plain-list">
            {report.uncertainty.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </Collapsible>
      </div>

      <div className="cta">
        <button className="primary-btn" onClick={onReset}>
          <Icon name="refresh" size={18} /> Ask another question
        </button>
        <p className="footnote">
          TrustLayer does not claim absolute truth. It helps you understand how much scrutiny an AI answer deserves.
        </p>
      </div>
    </main>
  );
}
