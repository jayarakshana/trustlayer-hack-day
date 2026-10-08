// Mock of the report the FastAPI backend will eventually return from POST /analyze.
// Levels are "HIGH" | "MEDIUM" | "LOW". Verdict is "RELIABLE" | "USE WITH CAUTION" | "UNRELIABLE".
// There is intentionally no numeric trust score.

export const exampleQuestions = [
  "Should I use PCA before XGBoost?",
  "Is intermittent fasting effective for weight loss?",
  "Should I use PostgreSQL or MongoDB for this application?",
];

export const mockReport = {
  question: "Should I use PCA before XGBoost?",
  verdict: "USE WITH CAUTION",
  verdict_summary:
    "The answers broadly agree on a direction, but the advice depends on context the question never provided.",
  why: [
    "3 of 5 answers concluded PCA is usually unnecessary before XGBoost; 2 said it can help in specific cases.",
    "The conclusion shifted when the question was rephrased to suggest high-dimensional or noisy data.",
    "Most claims match well-known properties of tree-based models, but none are tied to your dataset.",
    "Key context is missing: number of features, feature correlation, dataset size, and interpretability needs.",
  ],
  signals: {
    answer_stability: { level: "MEDIUM", explanation: "Most answers lean the same way, but two diverge." },
    prompt_sensitivity: { level: "HIGH", explanation: "Rewording the question noticeably changed the advice." },
    claim_consistency: { level: "MEDIUM", explanation: "Core claims repeat across answers; a few conflict." },
    evidence_support: { level: "MEDIUM", explanation: "Claims match common ML practice, but no sources were cited." },
    missing_context: { level: "HIGH", explanation: "The question omits details that change the right answer." },
  },
  agreement: {
    agreed: 3,
    total: 5,
    summary: "3 of 5 answers reached the same conclusion: PCA is usually not needed before XGBoost.",
  },
  equivalent_questions: [
    "Is PCA a useful preprocessing step before training an XGBoost model?",
    "Does applying dimensionality reduction with PCA improve XGBoost results?",
    "Is it a good idea to run PCA on my features before gradient boosting with XGBoost?",
    "When does PCA help or hurt an XGBoost model?",
    "Do I need PCA if I plan to train XGBoost on my dataset?",
  ],
  answers: [
    {
      question: "Is PCA a useful preprocessing step before training an XGBoost model?",
      conclusion: "Usually not needed",
      text: "XGBoost handles many features and correlated inputs well, so PCA is typically unnecessary. It can discard information trees would use and makes features harder to interpret.",
    },
    {
      question: "Does applying dimensionality reduction with PCA improve XGBoost results?",
      conclusion: "Usually not needed",
      text: "In most cases it does not. Tree-based models split on individual features, and PCA components blend features together, which often reduces performance.",
    },
    {
      question: "Is it a good idea to run PCA on my features before gradient boosting with XGBoost?",
      conclusion: "Can help",
      text: "It can be useful when you have hundreds or thousands of noisy, highly correlated features, since it may cut training time and reduce overfitting.",
    },
    {
      question: "When does PCA help or hurt an XGBoost model?",
      conclusion: "Usually not needed",
      text: "PCA rarely helps. It may be worth trying for very high-dimensional data or to speed up training, but you should validate against a baseline without it.",
    },
    {
      question: "Do I need PCA if I plan to train XGBoost on my dataset?",
      conclusion: "Can help",
      text: "Not strictly, but PCA can reduce noise and dimensionality for wide datasets. Compare cross-validated results with and without it.",
    },
  ],
  claims: [
    { text: "XGBoost handles correlated and high-dimensional features well without PCA.", appears_in: "4 of 5 answers", status: "Consistent" },
    { text: "PCA components are harder to interpret than original features.", appears_in: "3 of 5 answers", status: "Consistent" },
    { text: "PCA can reduce training time on very wide datasets.", appears_in: "3 of 5 answers", status: "Consistent" },
    { text: "PCA often reduces XGBoost accuracy.", appears_in: "2 of 5 answers", status: "Disputed" },
    { text: "PCA reduces overfitting for tree-based models.", appears_in: "2 of 5 answers", status: "Weak support" },
  ],
  assumptions: [
    "The dataset is tabular rather than images or text.",
    "The number of features is large enough for dimensionality to matter.",
    "Model accuracy matters more than interpretability.",
    "The data has been scaled and cleaned appropriately.",
  ],
  contradictions: [
    {
      between: "Answer 1 vs Answer 3",
      detail: "Answer 1 says PCA tends to remove information XGBoost would use. Answer 3 says PCA helps reduce overfitting. Neither is universally true.",
    },
    {
      between: "Answer 2 vs Answer 5",
      detail: "Answer 2 says PCA often hurts performance. Answer 5 says it can improve results on wide datasets.",
    },
  ],
  uncertainty: [
    "The answers do not know how many features your dataset has.",
    "Whether PCA helps depends on your data and can only be confirmed by cross-validation.",
    "No answer cited benchmarks or sources for its performance claims.",
  ],
};
