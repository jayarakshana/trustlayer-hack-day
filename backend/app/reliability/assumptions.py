def detect_assumptions(answers: list[dict]) -> list[dict]:
    """
    Identify answers that rely on an unstated assumption.
    """

    assumptions = []

    if not answers:
        return assumptions

    assumption_words = [
        "if",
        "assuming",
        "provided",
        "unless",
        "depends",
        "likely",
        "probably",
        "might",
        "may",
    ]

    for index, answer in enumerate(answers):
        text = str(answer.get("answer", "")).strip()

        if not text:
            continue

        lower_text = text.lower()

        matched_words = [
            word for word in assumption_words
            if word in lower_text
        ]

        if matched_words:
            assumptions.append({
                "answer": index,
                "indicators": matched_words,
                "type": "UNSTATED_ASSUMPTION"
            })

    return assumptions