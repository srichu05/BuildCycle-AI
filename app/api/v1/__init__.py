"""API v1 package router configuration."""
from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.model import router as model_router
from app.api.v1.analyses import router as analyses_router
from app.api.v1.reports import router as reports_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["Health"])
api_router.include_router(model_router, prefix="/model", tags=["Model"])
api_router.include_router(analyses_router, prefix="/analyses", tags=["Analyses"])
api_router.include_router(reports_router, prefix="/analyses", tags=["Reports"])
