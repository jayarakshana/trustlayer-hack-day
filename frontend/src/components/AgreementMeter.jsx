import Icon from "./Icon.jsx";

// Shows which answers agree with the majority conclusion.
export default function AgreementMeter({ answers, summary }) {
  const counts = {};
  answers.forEach((a) => { counts[a.conclusion] = (counts[a.conclusion] || 0) + 1; });
  const majority = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const agreed = counts[majority] || 0;

  return (
    <div className="agreement glass">
      <div className="agreement-intro">
        <div className="agreement-big"><b>{agreed}</b><span>of {answers.length}</span></div>
        <div>
          <div className="agreement-title">answers agree</div>
          <p className="agreement-sub">{summary}</p>
        </div>
      </div>
      <div className="agree-track">
        {answers.map((a, i) => {
          const agrees = a.conclusion === majority;
          return (
            <div key={a.question} className={`agree-node ${agrees ? "agrees" : "differs"}`}>
              <span className="agree-circle">
                {agrees ? <Icon name="check" size={20} /> : <Icon name="shuffle" size={18} />}
              </span>
              <span className="agree-n">ANSWER {i + 1}</span>
              <span className="agree-label">{a.conclusion}</span>
            </div>
          );
        })}
      </div>
      <div className="agree-legend">
        <span><i className="lg lg-agree" /> Majority conclusion</span>
        <span><i className="lg lg-differs" /> Different conclusion</span>
      </div>
    </div>
  );
}
