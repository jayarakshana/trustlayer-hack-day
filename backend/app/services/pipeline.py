import json
import os


def run_analysis(question: str):
    use_mock = os.getenv("USE_MOCK", "true").lower() == "true"

    if use_mock:
        mock_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            "data",
            "mock_data.json"
        )

        with open(mock_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["question"] = question
        return data

    raise NotImplementedError("Live pipeline is not connected yet.")