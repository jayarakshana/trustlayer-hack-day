from .stability import calculate_stability
from .claims import extract_claims


def test_stability_high():
    assert calculate_stability(["YES", "YES", "YES"]) == "HIGH"


def test_stability_medium():
    assert calculate_stability(["YES", "YES", "NO"]) == "MEDIUM"


def test_stability_low():
    assert calculate_stability(["YES", "NO", "MAYBE"]) == "LOW"


def test_stability_empty():
    assert calculate_stability([]) == "LOW"


def test_extract_claims():
    answer = "Python is useful. Python is widely used."
    claims = extract_claims(answer)

    assert len(claims) == 2
    assert claims[0] == "Python is useful"
    assert claims[1] == "Python is widely used"


def test_extract_claims_empty():
    assert extract_claims("") == []