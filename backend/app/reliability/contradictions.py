def detect_contradictions(answers: list[dict]) -> list[dict]:
    """
    Detect direct contradictions between answer conclusions.
    """

    contradictions = []

    if not answers:
        return contradictions

    for i in range(len(answers)):
        for j in range(i + 1, len(answers)):
            conclusion_a = str(
                answers[i].get("conclusion", "")
            ).strip().upper()

            conclusion_b = str(
                answers[j].get("conclusion", "")
            ).strip().upper()

            if not conclusion_a or not conclusion_b:
                continue

            opposite_pairs = {
                ("YES", "NO"),
                ("NO", "YES"),
                ("TRUE", "FALSE"),
                ("FALSE", "TRUE"),
            }

            if (conclusion_a, conclusion_b) in opposite_pairs:
                contradictions.append({
                    "answer_a": i,
                    "answer_b": j,
                    "conclusion_a": conclusion_a,
                    "conclusion_b": conclusion_b,
                    "type": "DIRECT_CONTRADICTION"
                })

    return contradictions