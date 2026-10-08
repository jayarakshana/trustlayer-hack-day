import json
import os

from app.ai.generator import run_engine
from app.reliability.report import analyze


def run_analysis(question: str):
    use_mock = os.getenv("USE_MOCK", "true").lower() == "true"

    if use_mock:
        mock_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            "data",
            "mock_data.json"
        )

        with open(mock_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["question"] = question
        return data

    engine_result = run_engine(question)
    reliability_result = analyze(question, engine_result["answers"])

    return {
        "question": question,
        "variations": engine_result["variations"],
        "answers": engine_result["answers"],
        "claims": reliability_result["claims"],
        "reliability": reliability_result["reliability"],
        "contradictions": reliability_result["contradictions"],
        "assumptions": reliability_result["assumptions"],
        "verdict": reliability_result["verdict"],
    }
