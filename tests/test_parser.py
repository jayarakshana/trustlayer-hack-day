from backend.app.ai.parser import extract_conclusion, extract_json, parse_answer, parse_variations


def test_extract_json_with_markdown_fence():
    text = 'Here you go:\n```json\n{"variations":["A","B"]}\n```'
    assert extract_json(text)["variations"] == ["A", "B"]


def test_parse_variations_deduplicates():
    text = '{"variations":["A","A"," B "]}'
    assert parse_variations(text, expected=5) == ["A", "B"]


def test_extract_conclusion():
    assert extract_conclusion("The answer is positive.\nCONCLUSION: YES") == "YES"
    assert extract_conclusion("It depends.\nCONCLUSION: CONDITIONAL") == "CONDITIONAL"
    assert extract_conclusion("No.\nCONCLUSION: NO") == "NO"


def test_parse_answer_removes_tag():
    result = parse_answer("Paris is the capital of France.\nCONCLUSION: YES")
    assert result["conclusion"] == "YES"
    assert "CONCLUSION:" not in result["answer"]
