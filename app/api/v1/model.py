from fastapi import APIRouter
from app.schemas.analyses import ModelStatusResponse
from app.services.detector import detector_service

router = APIRouter()


@router.get("/status", response_model=ModelStatusResponse)
def model_status():
    """
    Return currently configured model status and supported classes.
    Classes are read dynamically from loaded model metadata.
    """
    info = detector_service.get_status()
    return {
        "loaded": info["loaded"],
        "model_name": info["model_name"],
        "model_version": info["model_version"],
        "task": info["task"],
        "classes": info["classes"],
        "confidence_threshold": info["confidence_threshold"],
    }
