def calculate_stability(conclusions: list[str]) -> str:
    """
    Calculate how stable the model's conclusions are.

    HIGH   -> all conclusions agree
    MEDIUM -> some conclusions agree, some differ
    LOW    -> conclusions are highly inconsistent
    """

    if not conclusions:
        return "LOW"

    # Normalize conclusions
    normalized = [
        str(c).strip().upper()
        for c in conclusions
        if c is not None
    ]

    if not normalized:
        return "LOW"

    # Count how many times each conclusion appears
    counts = {}

    for conclusion in normalized:
        counts[conclusion] = counts.get(conclusion, 0) + 1

    total = len(normalized)
    most_common = max(counts.values())

    agreement_ratio = most_common / total

    if agreement_ratio == 1.0:
        return "HIGH"

    if agreement_ratio >= 0.5:
        return "MEDIUM"

    return "LOW"