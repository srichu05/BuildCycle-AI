import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db, get_session_factory
from app.db.repositories import (
    create_analysis_with_detections,
    get_analysis_by_id,
    list_analyses,
)
from app.schemas.analyses import (
    AnalysisResponse,
    AnalysisListResponse,
    AnalysisListItem,
    ImageMetadata,
    ModelMetadata,
    AnalysisSummary,
    CompositionInfo,
    RecommendationItem,
    DetectionItem,
    BoundingBox,
)
from app.services.detector import detector_service, ModelNotReadyError, InferenceFailedError
from app.services.image_processor import (
    validate_and_decode_image,
    annotate_image,
    ImageValidationError,
)
from app.services.composition import calculate_composition
from app.services.recovery import get_recommendations_for_materials

router = APIRouter()


@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
def create_analysis(
    file: UploadFile = File(...),
):
    """
    Accept an uploaded construction waste image, run YOLO inference,
    calculate bounding-box coverage and recovery recommendations,
    annotate the image, and persist metadata and detections in Neon PostgreSQL.
    """
    if not file or not file.filename:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": {
                    "code": "INVALID_IMAGE",
                    "message": "A valid image file must be provided in the 'file' field.",
                }
            },
        )

    # Sanitize basename only
    clean_filename = os.path.basename(file.filename)

    # Read uploaded bytes
    try:
        file_bytes = file.file.read()
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": {
                    "code": "INVALID_IMAGE",
                    "message": "Failed to read uploaded file contents.",
                }
            },
        )

    # Validate and decode image
    try:
        cv2_img, width, height, sha256 = validate_and_decode_image(
            file_bytes=file_bytes,
            filename=clean_filename,
            max_bytes=settings.max_upload_bytes,
        )
    except ImageValidationError as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"error": {"code": e.code, "message": e.message}},
        )

    # Run model prediction
    try:
        raw_detections, inference_duration_ms = detector_service.predict(cv2_img)
    except ModelNotReadyError as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"error": {"code": e.code, "message": e.message}},
        )
    except InferenceFailedError as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"error": {"code": e.code, "message": e.message}},
        )

    # Compute composition & material counts
    material_counts, composition = calculate_composition(
        detections=raw_detections,
        image_width=width,
        image_height=height,
    )

    # Generate deterministic recovery recommendations
    distinct_materials = list(material_counts.keys())
    recommendations = get_recommendations_for_materials(distinct_materials)

    # Annotate image
    annotated_base64 = annotate_image(cv2_img, raw_detections)

    analysis_uuid = uuid.uuid4()
    model_status = detector_service.get_status()

    # Persist to Neon PostgreSQL
    session_factory = get_session_factory()
    if session_factory is None:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": "DATABASE_URL is not configured. Persistence to Neon failed.",
                }
            },
        )

    try:
        db = session_factory()
        try:
            create_analysis_with_detections(
                db=db,
                analysis_id=analysis_uuid,
                original_filename=clean_filename,
                image_width=width,
                image_height=height,
                model_name=model_status["model_name"],
                model_version=model_status["model_version"],
                model_task=model_status["task"],
                inference_time_ms=inference_duration_ms,
                total_detections=len(raw_detections),
                composition_json=composition,
                recommendations_json=recommendations,
                detections=raw_detections,
                image_sha256=sha256,
            )
        finally:
            db.close()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": f"Failed to persist analysis to database: {str(e)}",
                }
            },
        )

    # Construct and return response adhering strictly to API_CONTRACT.md
    detection_items = [
        DetectionItem(
            class_name=d["class_name"],
            confidence=d["confidence"],
            bbox=BoundingBox(
                x1=d["bbox"]["x1"],
                y1=d["bbox"]["y1"],
                x2=d["bbox"]["x2"],
                y2=d["bbox"]["y2"],
            ),
            bbox_area_percent=d.get("bbox_area_percent", 0.0),
        )
        for d in raw_detections
    ]

    recommendation_items = [
        RecommendationItem(
            material=r["material"],
            pathway=r["pathway"],
            title=r["title"],
            description=r["description"],
            caution=r["caution"],
        )
        for r in recommendations
    ]

    return {
        "analysis_id": str(analysis_uuid),
        "status": "completed",
        "image": {
            "filename": clean_filename,
            "width": width,
            "height": height,
        },
        "model": {
            "name": model_status["model_name"],
            "version": model_status["model_version"],
            "task": model_status["task"],
        },
        "summary": {
            "total_objects": len(raw_detections),
            "material_counts": material_counts,
        },
        "detections": detection_items,
        "composition": composition,
        "recommendations": recommendation_items,
        "annotated_image_base64": annotated_base64,
        "inference_time_ms": inference_duration_ms,
    }


@router.get("", response_model=AnalysisListResponse)
def get_analyses(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """
    List stored analyses with pagination.
    """
    session_factory = get_session_factory()
    if session_factory is None:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": "DATABASE_URL is not configured.",
                }
            },
        )

    try:
        db = session_factory()
        try:
            items, total = list_analyses(db=db, limit=limit, offset=offset)
            list_items = [
                AnalysisListItem(
                    analysis_id=str(item.id),
                    created_at=item.created_at.isoformat() if item.created_at else "",
                    original_filename=item.original_filename,
                    total_detections=item.total_detections,
                    model_name=item.model_name,
                )
                for item in items
            ]
            return {
                "items": list_items,
                "limit": limit,
                "offset": offset,
                "total": total,
            }
        finally:
            db.close()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": f"Database query failed: {str(e)}",
                }
            },
        )


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_single_analysis(
    analysis_id: str,
):
    """
    Retrieve a saved analysis and its detections by ID.
    Images are not persisted, so annotated_image_base64 is returned as null.
    """
    try:
        target_uuid = uuid.UUID(analysis_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "error": {
                    "code": "ANALYSIS_NOT_FOUND",
                    "message": f"Analysis with ID '{analysis_id}' was not found.",
                }
            },
        )

    session_factory = get_session_factory()
    if session_factory is None:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": "DATABASE_URL is not configured.",
                }
            },
        )

    try:
        db = session_factory()
        try:
            analysis = get_analysis_by_id(db=db, analysis_id=target_uuid)
            if not analysis:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={
                        "error": {
                            "code": "ANALYSIS_NOT_FOUND",
                            "message": f"Analysis with ID '{analysis_id}' was not found.",
                        }
                    },
                )

            # Reconstruct detections
            detections = [
                DetectionItem(
                    class_name=det.class_name,
                    confidence=det.confidence,
                    bbox=BoundingBox(
                        x1=det.x1,
                        y1=det.y1,
                        x2=det.x2,
                        y2=det.y2,
                    ),
                    bbox_area_percent=det.bbox_area_percent or 0.0,
                )
                for det in analysis.detections
            ]

            # Reconstruct material counts from saved detections
            counts = {}
            for d in analysis.detections:
                counts[d.class_name] = counts.get(d.class_name, 0) + 1

            return {
                "analysis_id": str(analysis.id),
                "status": "completed",
                "image": {
                    "filename": analysis.original_filename,
                    "width": analysis.image_width,
                    "height": analysis.image_height,
                },
                "model": {
                    "name": analysis.model_name,
                    "version": analysis.model_version,
                    "task": analysis.model_task,
                },
                "summary": {
                    "total_objects": analysis.total_detections,
                    "material_counts": counts,
                },
                "detections": detections,
                "composition": analysis.composition_json,
                "recommendations": analysis.recommendations_json,
                "annotated_image_base64": None,
                "inference_time_ms": analysis.inference_time_ms,
            }
        finally:
            db.close()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": f"Database query failed: {str(e)}",
                }
            },
        )
