from backend.app.ai import generator


def test_generate_answers_parallel_and_order(monkeypatch, tmp_path):
    monkeypatch.setattr(generator, "CACHE_PATH", tmp_path / "cache.sqlite3")

    def fake_ask(prompt, system_prompt="", **kwargs):
        tail = prompt.split("Answer this question:", 1)[1]
        question = next(line.strip() for line in tail.splitlines() if line.strip())
        return f"Answer for {question}\nCONCLUSION: YES"

    monkeypatch.setattr(generator, "ask_llm", fake_ask)

    result = generator.generate_answers(["Q1", "Q2", "Q3"], max_workers=3)

    assert [x["answer"] for x in result] == [
        "Answer for Q1",
        "Answer for Q2",
        "Answer for Q3",
    ]
    assert [x["conclusion"] for x in result] == ["YES", "YES", "YES"]
