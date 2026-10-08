from pydantic import BaseModel
from typing import List, Dict, Any


class AnalyzeRequest(BaseModel):
    question: str


class AnalysisResponse(BaseModel):
    question: str
    variations: List[str]
    answers: List[Dict[str, Any]]
    claims: List[Dict[str, Any]]
    reliability: Dict[str, Any]