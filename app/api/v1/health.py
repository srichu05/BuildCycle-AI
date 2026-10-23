from fastapi import APIRouter, Response, status
from fastapi.responses import JSONResponse
from app.db.session import check_db_ready
from app.schemas.analyses import HealthLiveResponse, HealthReadyResponse
from app.services.detector import detector_service

router = APIRouter()


@router.get("/live", response_model=HealthLiveResponse)
def health_live():
    """
    Process liveness probe.
    Must not require database or model.
    """
    return {"status": "ok"}


@router.get("/ready", response_model=HealthReadyResponse)
def health_ready():
    """
    Runtime readiness probe.
    Checks database connectivity and model readiness.
    """
    db_ok = check_db_ready()
    model_ok = detector_service.is_loaded

    if not db_ok:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": "Database is not connected or ready.",
                }
            },
        )

    if not model_ok:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "MODEL_NOT_READY",
                    "message": detector_service.load_error or "Detection model is not ready.",
                }
            },
        )

    return {
        "status": "ready",
        "database": "ok",
        "model": "ready",
    }
