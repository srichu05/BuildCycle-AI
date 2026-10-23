import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1 import api_router
from app.core.config import settings
from app.services.detector import detector_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("buildcycle")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Loads the YOLO model weights once at startup.
    """
    logger.info("Initializing BuildCycle AI Backend...")
    loaded = detector_service.load_model()
    if loaded:
        logger.info(
            f"Detector loaded successfully. Classes: {detector_service.classes}"
        )
    else:
        logger.warning(
            f"Detector failed to load: {detector_service.load_error}"
        )
    yield
    logger.info("Shutting down BuildCycle AI Backend.")


app = FastAPI(
    title="BuildCycle AI Backend",
    description="AI-powered construction waste intelligence and recovery backend",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix="/api/v1")


# Global Exception Handlers conforming to API_CONTRACT.md error format
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    code_map = {
        400: "INVALID_IMAGE",
        404: "ANALYSIS_NOT_FOUND",
        413: "FILE_TOO_LARGE",
        415: "INVALID_FILE_TYPE",
        500: "INTERNAL_ERROR",
        503: "DATABASE_UNAVAILABLE",
    }
    error_code = code_map.get(exc.status_code, "ERROR")
    # If exc.detail is already a dict with "error"
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": error_code,
                "message": str(exc.detail),
            }
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": {
                "code": "INVALID_IMAGE",
                "message": "Validation failed for request parameters or uploaded payload.",
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred while processing the request.",
            }
        },
    )
