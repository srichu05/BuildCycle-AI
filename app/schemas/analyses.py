from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class DetectionItem(BaseModel):
    class_name: str
    confidence: float
    bbox: BoundingBox
    bbox_area_percent: float


class ImageMetadata(BaseModel):
    filename: str
    width: int
    height: int


class ModelMetadata(BaseModel):
    name: str
    version: Optional[str] = "configured-or-unknown"
    task: str = "detect"


class AnalysisSummary(BaseModel):
    total_objects: int
    material_counts: Dict[str, int]


class CompositionInfo(BaseModel):
    method: str = "bounding_box_area"
    coverage_percent_by_class: Dict[str, float]
    overlap_warning: bool = True


class RecommendationItem(BaseModel):
    material: str
    pathway: str
    title: str
    description: str
    caution: str


class AnalysisResponse(BaseModel):
    analysis_id: str
    status: str = "completed"
    image: ImageMetadata
    model: ModelMetadata
    summary: AnalysisSummary
    detections: List[DetectionItem]
    composition: CompositionInfo
    recommendations: List[RecommendationItem]
    annotated_image_base64: Optional[str] = None
    inference_time_ms: Optional[int] = None


class AnalysisListItem(BaseModel):
    analysis_id: str
    created_at: str
    original_filename: str
    total_detections: int
    model_name: str


class AnalysisListResponse(BaseModel):
    items: List[AnalysisListItem]
    limit: int = 20
    offset: int = 0
    total: int


class ModelStatusResponse(BaseModel):
    loaded: bool
    model_name: str
    model_version: Optional[str] = "configured-or-unknown"
    task: str = "detect"
    classes: List[str]
    confidence_threshold: float


class HealthLiveResponse(BaseModel):
    status: str = "ok"


class HealthReadyResponse(BaseModel):
    status: str = "ready"
    database: str = "ok"
    model: str = "ready"


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail
