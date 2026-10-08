"""Small, synchronous wrapper around the local Ollama HTTP API."""

from __future__ import annotations

import os
from typing import Any

import requests


OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
OLLAMA_TIMEOUT = float(os.getenv("OLLAMA_TIMEOUT", "60"))

_session = requests.Session()


class OllamaError(RuntimeError):
    """Raised when Ollama cannot produce a usable response."""


def ask_llm(
    prompt: str,
    system_prompt: str = "",
    *,
    json_mode: bool = False,
    timeout: float | None = None,
) -> str:
    """Call Ollama /api/generate and return only the generated response text."""
    if not prompt or not prompt.strip():
        raise ValueError("prompt must not be empty")

    payload: dict[str, Any] = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "system": system_prompt,
        "stream": False,
    }

    # Ollama supports structured output with format="json".
    # The prompt still describes the expected schema because not every model
    # follows structured output equally well.
    if json_mode:
        payload["format"] = "json"

    try:
        response = _session.post(
            OLLAMA_URL,
            json=payload,
            timeout=timeout or OLLAMA_TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        raise OllamaError(f"Ollama request failed: {exc}") from exc
    except ValueError as exc:
        raise OllamaError("Ollama returned invalid JSON") from exc

    text = data.get("response")
    if not isinstance(text, str) or not text.strip():
        raise OllamaError("Ollama returned an empty response")

    return text.strip()


def ollama_is_ready() -> bool:
    """Cheap readiness check used by tests/health endpoints."""
    try:
        response = _session.get(
            OLLAMA_URL.rsplit("/api/generate", 1)[0] + "/api/tags",
            timeout=5,
        )
        return response.ok
    except requests.RequestException:
        return False
