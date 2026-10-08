from fastapi import APIRouter, HTTPException

from app.schemas.analysis import AnalyzeRequest, AnalysisResponse
from app.services.pipeline import run_analysis


router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
def analyze(request: AnalyzeRequest):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    try:
        return run_analysis(request.question)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )