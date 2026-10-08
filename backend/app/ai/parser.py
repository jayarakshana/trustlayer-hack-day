"""Defensive parsing for imperfect LLM output."""

from __future__ import annotations

import json
import re
from typing import Any


CONCLUSIONS = ("YES", "NO", "CONDITIONAL")


class LLMParseError(ValueError):
    """Raised when model output cannot be converted to the expected shape."""


def _candidate_json_strings(text: str) -> list[str]:
    text = text.strip()
    candidates = [text]

    # Remove common markdown fences.
    fenced = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.I | re.S).strip()
    if fenced != text:
        candidates.append(fenced)

    # Find the first balanced-looking object/array region. This is deliberately
    # permissive; json.loads remains the final validator.
    starts = [i for i, ch in enumerate(text) if ch in "[{"]
    ends = [i for i, ch in enumerate(text) if ch in "]}"]
    if starts and ends:
        candidates.append(text[min(starts): max(ends) + 1])

    # Also try a fenced/cleaned version.
    starts = [i for i, ch in enumerate(fenced) if ch in "[{"]
    ends = [i for i, ch in enumerate(fenced) if ch in "]}"]
    if starts and ends:
        candidates.append(fenced[min(starts): max(ends) + 1])

    # Preserve order while removing duplicates.
    return list(dict.fromkeys(candidates))


def extract_json(text: str) -> Any:
    """Extract the first valid JSON value from text, even with surrounding prose."""
    if not text or not text.strip():
        raise LLMParseError("empty LLM output")

    for candidate in _candidate_json_strings(text):
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            continue

    raise LLMParseError("no valid JSON found in LLM output")


def parse_variations(text: str, *, expected: int = 5) -> list[str]:
    """Parse {"variations": [...]} and normalize/deduplicate the result."""
    data = extract_json(text)

    if isinstance(data, dict):
        values = data.get("variations")
    elif isinstance(data, list):
        # Regex fallback may return a bare list.
        values = data
    else:
        values = None

    if not isinstance(values, list):
        raise LLMParseError("expected a 'variations' list")

    result: list[str] = []
    seen: set[str] = set()

    for item in values:
        if not isinstance(item, str):
            continue
        value = re.sub(r"\s+", " ", item).strip()
        key = value.casefold()
        if value and key not in seen:
            result.append(value)
            seen.add(key)
        if len(result) >= expected:
            break

    if not result:
        raise LLMParseError("no usable question variations found")

    return result


_CONCLUSION_RE = re.compile(
    r"(?:CONCLUSION|CONCLUSION\s+TAG)\s*:\s*(YES|NO|CONDITIONAL)\b",
    flags=re.I,
)


def extract_conclusion(text: str) -> str:
    """Extract YES/NO/CONDITIONAL, with a conservative keyword fallback."""
    if not text or not text.strip():
        raise LLMParseError("empty answer")

    match = _CONCLUSION_RE.search(text)
    if match:
        return match.group(1).upper()

        # Fallback for models that omit the exact label.
    tail = text[-500:].upper()

    if re.search(r"\bCONDITIONAL\b", tail):
        return "CONDITIONAL"
    if re.search(r"\bYES\b", tail):
        return "YES"
    if re.search(r"\bNO\b", tail):
        return "NO"

    # Last-resort semantic fallback for short factual answers.
    if re.search(r"\b(can|does|do|is|are|helps?|benefits?|improves?|good|healthy)\b", tail, re.I):
        return "YES"
    raise LLMParseError("could not extract YES/NO/CONDITIONAL conclusion")


def parse_answer(text: str) -> dict[str, str]:
    """Return the answer body and normalized conclusion tag."""
    conclusion = extract_conclusion(text)

    # Remove the tag from the answer shown to the user.
    body = _CONCLUSION_RE.sub("", text).strip()
    body = re.sub(r"\n\s*$", "", body)

    return {
        "answer": body,
        "conclusion": conclusion,
        "raw": text,
    }
