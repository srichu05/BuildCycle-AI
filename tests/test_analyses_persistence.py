import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.db.repositories import (
    create_analysis_with_detections,
    get_analysis_by_id,
    list_analyses,
)


def test_persistence_repository_workflow():
    # Use SQLite in-memory engine strictly for unit testing repository functions
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    analysis_id = uuid.uuid4()
    raw_detections = [
        {
            "class_name": "brick",
            "confidence": 0.89,
            "bbox": {"x1": 10.0, "y1": 20.0, "x2": 110.0, "y2": 120.0},
            "bbox_area_percent": 1.25,
        },
        {
            "class_name": "concrete",
            "confidence": 0.94,
            "bbox": {"x1": 150.0, "y1": 150.0, "x2": 350.0, "y2": 350.0},
            "bbox_area_percent": 4.50,
        },
    ]

    analysis = create_analysis_with_detections(
        db=db,
        analysis_id=analysis_id,
        original_filename="rubble.jpg",
        image_width=1920,
        image_height=1080,
        model_name="construction-waste-yolo",
        model_version="v8l",
        model_task="detect",
        inference_time_ms=120,
        total_detections=len(raw_detections),
        composition_json={"method": "bounding_box_area", "coverage_percent_by_class": {"brick": 1.25, "concrete": 4.50}},
        recommendations_json=[{"material": "brick", "pathway": "salvage_and_aggregate"}],
        detections=raw_detections,
        image_sha256="abc12345",
    )

    assert analysis.id == analysis_id
    assert analysis.total_detections == 2
    assert len(analysis.detections) == 2

    # Query single analysis
    retrieved = get_analysis_by_id(db, analysis_id)
    assert retrieved is not None
    assert retrieved.original_filename == "rubble.jpg"
    assert len(retrieved.detections) == 2

    # Query list
    items, total = list_analyses(db, limit=10, offset=0)
    assert total == 1
    assert len(items) == 1
    assert items[0].id == analysis_id

    db.close()
