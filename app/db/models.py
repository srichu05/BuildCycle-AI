import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    Index,
    Uuid,
    JSON,
    func,
)
from sqlalchemy.orm import relationship
from app.db.session import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    original_filename = Column(String(255), nullable=False)
    image_sha256 = Column(String(64), nullable=True)
    image_width = Column(Integer, nullable=False)
    image_height = Column(Integer, nullable=False)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(100), nullable=True)
    model_task = Column(String(30), nullable=False, default="detect")
    inference_time_ms = Column(Integer, nullable=True)
    total_detections = Column(Integer, nullable=False, default=0)
    composition_json = Column(JSON, nullable=False)
    recommendations_json = Column(JSON, nullable=False)

    detections = relationship(
        "Detection",
        back_populates="analysis",
        cascade="all, delete-orphan",
        order_by="Detection.confidence.desc()",
    )

    __table_args__ = (
        Index("idx_analyses_created_at_desc", created_at.desc()),
        Index("idx_analyses_model_name", model_name),
    )


class Detection(Base):
    __tablename__ = "detections"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(
        Uuid(as_uuid=True),
        ForeignKey("analyses.id", ondelete="CASCADE"),
        nullable=False,
    )
    class_name = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    bbox_area_percent = Column(Float, nullable=True)

    analysis = relationship("Analysis", back_populates="detections")

    __table_args__ = (
        Index("idx_detections_analysis_id", analysis_id),
    )
