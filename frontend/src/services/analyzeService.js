// Single place that talks to the "backend".
// Phase 1: returns mock data. Phase 2: set VITE_USE_MOCK=false to call the real API.
//
// Real endpoint later:  POST {API_URL}/analyze   body: { "question": "..." }
import { mockReport } from "../mock/mockReport.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeQuestion(question) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300)); // pretend network delay
    return { ...mockReport, question };
  }

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error(`Analysis failed (HTTP ${response.status})`);
  }
  return response.json();
}
