import { useState } from "react";
import AskPage from "./pages/AskPage.jsx";
import AnalyzingPage from "./pages/AnalyzingPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";

// The whole app is three screens: ask -> analyzing -> report.
export default function App() {
  const [screen, setScreen] = useState("ask");
  const [question, setQuestion] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  function handleAnalyze(q) {
    setQuestion(q);
    setError("");
    setScreen("analyzing");
  }

  function handleDone(result) {
    setReport(result);
    setScreen("report");
  }

  function handleFail(message) {
    setError(message);
    setScreen("ask");
  }

  function handleReset() {
    setQuestion("");
    setReport(null);
    setError("");
    setScreen("ask");
  }

  return (
    <div className="app">
      {screen === "ask" && (
        <AskPage initialQuestion={question} error={error} onAnalyze={handleAnalyze} />
      )}
      {screen === "analyzing" && (
        <AnalyzingPage question={question} onDone={handleDone} onFail={handleFail} />
      )}
      {screen === "report" && <ReportPage report={report} onReset={handleReset} />}
    </div>
  );
}
