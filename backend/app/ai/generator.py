"""TrustLayer question variation and independent-answer generation."""

from __future__ import annotations

import hashlib
import json
import os
import sqlite3
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Iterable

from .model import ask_llm
from .parser import LLMParseError, parse_answer, parse_variations
from .prompts import (
    ANSWER_SYSTEM_PROMPT,
    ANSWER_USER_TEMPLATE,
    VARIATION_SYSTEM_PROMPT,
    VARIATION_USER_TEMPLATE,
)


CACHE_PATH = Path(os.getenv("TRUSTLAYER_CACHE", ".trustlayer_cache.sqlite3"))


def _cache_key(kind: str, value: str) -> str:
    return hashlib.sha256(f"{kind}\0{value}".encode("utf-8")).hexdigest()


def _cache_get(key: str) -> str | None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(CACHE_PATH) as db:
        db.execute(
            "CREATE TABLE IF NOT EXISTS llm_cache "
            "(key TEXT PRIMARY KEY, value TEXT NOT NULL)"
        )
        row = db.execute("SELECT value FROM llm_cache WHERE key = ?", (key,)).fetchone()
    return row[0] if row else None


def _cache_set(key: str, value: str) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(CACHE_PATH) as db:
        db.execute(
            "CREATE TABLE IF NOT EXISTS llm_cache "
            "(key TEXT PRIMARY KEY, value TEXT NOT NULL)"
        )
        db.execute(
            "INSERT OR REPLACE INTO llm_cache(key, value) VALUES (?, ?)",
            (key, value),
        )
        db.commit()


def _normalize_question(question: str) -> str:
    question = " ".join(question.split())
    if not question:
        raise ValueError("question must not be empty")
    return question


def generate_variations(question: str, n: int = 5) -> list[str]:
    """Generate 3-5 semantically equivalent rewrites of a question."""
    question = _normalize_question(question)
    n = max(3, min(int(n), 5))

    key = _cache_key("variations", f"{question}|{n}")
    cached = _cache_get(key)

    if cached:
        try:
            return parse_variations(cached, expected=n)
        except LLMParseError:
            pass  # stale/bad cache; regenerate

    prompt = VARIATION_USER_TEMPLATE.format(question=question, n=n)
    raw = ask_llm(prompt, VARIATION_SYSTEM_PROMPT, json_mode=True)

    try:
        variations = parse_variations(raw, expected=n)
    except LLMParseError:
        # One retry with an even stricter instruction.
        retry_prompt = (
            prompt
            + "\nIMPORTANT: Return ONLY valid JSON. No markdown and no explanation."
        )
        raw = ask_llm(retry_prompt, VARIATION_SYSTEM_PROMPT, json_mode=True)
        variations = parse_variations(raw, expected=n)

    _cache_set(key, json.dumps({"variations": variations}))
    return variations


def _answer_one(question: str) -> dict[str, str]:
    key = _cache_key("answer", question)
    cached = _cache_get(key)

    if cached:
        try:
            data = json.loads(cached)
            if {"answer", "conclusion", "raw"} <= data.keys():
                return data
        except (TypeError, json.JSONDecodeError):
            pass

    prompt = ANSWER_USER_TEMPLATE.format(question=question)
    raw = ask_llm(prompt, ANSWER_SYSTEM_PROMPT)
    parsed = parse_answer(raw)
    _cache_set(key, json.dumps(parsed, ensure_ascii=False))
    return parsed


def generate_answers(
    variations: Iterable[str],
    *,
    max_workers: int | None = None,
) -> list[dict[str, str]]:
    """Answer each variation independently.

    Calls are parallelized because each variation is independent. The returned
    list preserves the input order, so the UI can map answers back to prompts.
    """
    questions = [_normalize_question(v) for v in variations]
    if not questions:
        return []

    workers = max_workers or min(5, len(questions))
    results: list[dict[str, str] | None] = [None] * len(questions)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        future_to_index = {
            pool.submit(_answer_one, question): index
            for index, question in enumerate(questions)
        }

        for future in as_completed(future_to_index):
            index = future_to_index[future]
            results[index] = future.result()

    return [item for item in results if item is not None]


def run_engine(question: str, n: int = 5) -> dict:
    """Convenience function for the backend route."""
    variations = generate_variations(question, n=n)
    answers = generate_answers(variations)
    return {
        "question": question,
        "variations": variations,
        "answers": answers,
        "metadata": {
            "variation_count": len(variations),
            "answer_count": len(answers),
            "model": os.getenv("OLLAMA_MODEL", "llama3.2:3b"),
        },
    }
