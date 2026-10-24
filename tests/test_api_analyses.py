import io
from PIL import Image
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.session import Base
from app.services.detector import detector_service
import app.db.session as db_session_module
import app.api.v1.analyses as analyses_module
import app.api.v1.reports as reports_module


@pytest.fixture(autouse=True)
def setup_test_environment(monkeypatch):
    """Setup static in-memory database and loaded detector service for testing."""
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(test_engine)
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    monkeypatch.setattr(db_session_module, "get_session_factory", lambda: TestSessionLocal)
    monkeypatch.setattr(analyses_module, "get_session_factory", lambda: TestSessionLocal)
    monkeypatch.setattr(reports_module, "get_session_factory", lambda: TestSessionLocal)
    monkeypatch.setattr(db_session_module, "check_db_ready", lambda: True)

    if not detector_service.is_loaded:
        detector_service.load_model()

    yield


def create_sample_image_bytes(width=640, height=480) -> bytes:
    img = Image.new("RGB", (width, height), color=(180, 120, 70))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_create_analysis_end_to_end():
    with TestClient(app) as client:
        img_bytes = create_sample_image_bytes(640, 480)

        response = client.post(
            "/api/v1/analyses",
            files={"file": ("site_debris.jpg", img_bytes, "image/jpeg")},
        )

        assert response.status_code == 200, response.text
        data = response.json()

        # Validate API contract schema
        assert "analysis_id" in data
        assert data["status"] == "completed"
        assert data["image"]["filename"] == "site_debris.jpg"
        assert data["image"]["width"] == 640
        assert data["image"]["height"] == 480
        assert data["model"]["name"] == "construction-waste-yolo"
        assert "total_objects" in data["summary"]
        assert "material_counts" in data["summary"]
        assert isinstance(data["detections"], list)
        assert data["composition"]["method"] == "bounding_box_area"
        assert "coverage_percent_by_class" in data["composition"]
        assert data["composition"]["overlap_warning"] is True
        assert isinstance(data["recommendations"], list)
        assert isinstance(data["annotated_image_base64"], str)
        assert data["inference_time_ms"] is not None

        analysis_id = data["analysis_id"]

        # Test single retrieval
        get_res = client.get(f"/api/v1/analyses/{analysis_id}")
        assert get_res.status_code == 200
        retrieved = get_res.json()
        assert retrieved["analysis_id"] == analysis_id
        assert retrieved["annotated_image_base64"] is None  # Not stored in DB
        assert retrieved["summary"]["total_objects"] == data["summary"]["total_objects"]

        # Test listing
        list_res = client.get("/api/v1/analyses")
        assert list_res.status_code == 200
        list_data = list_res.json()
        assert list_data["total"] >= 1
        assert any(item["analysis_id"] == analysis_id for item in list_data["items"])

        # Test CSV export
        csv_res = client.get(f"/api/v1/analyses/{analysis_id}/report.csv")
        assert csv_res.status_code == 200
        assert "text/csv" in csv_res.headers["content-type"]
        csv_text = csv_res.text
        assert "analysis_id,original_filename,created_at,class_name,confidence,x1,y1,x2,y2,bbox_area_percent" in csv_text


def test_create_analysis_invalid_file_type():
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/analyses",
            files={"file": ("report.pdf", b"%PDF-1.4 mock", "application/pdf")},
        )
        assert response.status_code == 415
        assert response.json()["error"]["code"] == "INVALID_FILE_TYPE"


def test_create_analysis_corrupt_image():
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/analyses",
            files={"file": ("bad.jpg", b"not-an-image", "image/jpeg")},
        )
        assert response.status_code == 400
        assert response.json()["error"]["code"] == "INVALID_IMAGE"


def test_get_nonexistent_analysis():
    with TestClient(app) as client:
        response = client.get("/api/v1/analyses/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404
        assert response.json()["error"]["code"] == "ANALYSIS_NOT_FOUND"
