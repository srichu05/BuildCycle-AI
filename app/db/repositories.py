import uuid
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy.orm import Session
from app.db.models import Analysis, Detection


def create_analysis_with_detections(
    db: Session,
    analysis_id: uuid.UUID,
    original_filename: str,
    image_width: int,
    image_height: int,
    model_name: str,
    model_version: Optional[str],
    model_task: str,
    inference_time_ms: Optional[int],
    total_detections: int,
    composition_json: Dict[str, Any],
    recommendations_json: List[Dict[str, Any]],
    detections: List[Dict[str, Any]],
    image_sha256: Optional[str] = None,
) -> Analysis:
    """Persist analysis metadata and all detection records in a single transaction."""
    analysis = Analysis(
        id=analysis_id,
        original_filename=original_filename,
        image_sha256=image_sha256,
        image_width=image_width,
        image_height=image_height,
        model_name=model_name,
        model_version=model_version,
        model_task=model_task,
        inference_time_ms=inference_time_ms,
        total_detections=total_detections,
        composition_json=composition_json,
        recommendations_json=recommendations_json,
    )
    db.add(analysis)

    for det in detections:
        bbox = det.get("bbox", {})
        detection_record = Detection(
            id=uuid.uuid4(),
            analysis_id=analysis_id,
            class_name=det["class_name"],
            confidence=det["confidence"],
            x1=bbox.get("x1", 0.0),
            y1=bbox.get("y1", 0.0),
            x2=bbox.get("x2", 0.0),
            y2=bbox.get("y2", 0.0),
            bbox_area_percent=det.get("bbox_area_percent"),
        )
        db.add(detection_record)

    db.commit()
    db.refresh(analysis)
    return analysis


def get_analysis_by_id(db: Session, analysis_id: uuid.UUID) -> Optional[Analysis]:
    """Retrieve an analysis by primary key."""
    return db.query(Analysis).filter(Analysis.id == analysis_id).first()


def list_analyses(
    db: Session, limit: int = 20, offset: int = 0
) -> Tuple[List[Analysis], int]:
    """List analyses with pagination ordered by created_at DESC."""
    total = db.query(Analysis).count()
    items = (
        db.query(Analysis)
        .order_by(Analysis.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return items, total
