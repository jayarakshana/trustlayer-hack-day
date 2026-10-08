from .stability import calculate_stability
from .claims import extract_and_cluster_claims
from .contradictions import detect_contradictions
from .assumptions import detect_assumptions


def analyze(question: str, answers: list[dict]) -> dict:
    """
    Generate a reliability report from multiple answers.
    """

    if not answers:
        return {
            "question": question,
            "claims": [],
            "contradictions": [],
            "assumptions": [],
            "reliability": {
                "answer_stability": "LOW",
                "prompt_sensitivity": "LOW",
            },
            "verdict": "UNCLEAR",
        }

    conclusions = [
        answer.get("conclusion", "UNCLEAR")
        for answer in answers
    ]

    answer_texts = [
        answer.get("answer", "")
        for answer in answers
    ]

    stability = calculate_stability(conclusions)
    claims = extract_and_cluster_claims(answer_texts)
    contradictions = detect_contradictions(answers)
    assumptions = detect_assumptions(answers)

    if stability == "HIGH" and not contradictions:
        verdict = "RELIABLE"
    elif stability == "MEDIUM":
        verdict = "REVIEW"
    else:
        verdict = "UNCLEAR"

    return {
        "question": question,
        "claims": claims,
        "contradictions": contradictions,
        "assumptions": assumptions,
        "reliability": {
            "answer_stability": stability,
            "prompt_sensitivity": (
                "LOW" if stability == "HIGH" else "MEDIUM"
            ),
        },
        "verdict": verdict,
    }
