from fastapi.testclient import TestClient
from app.main import app
from app.services.detector import detector_service


def test_health_live():
    with TestClient(app) as client:
        response = client.get("/api/v1/health/live")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


def test_model_status():
    with TestClient(app) as client:
        response = client.get("/api/v1/model/status")
        assert response.status_code == 200
        data = response.json()
        assert "loaded" in data
        assert "model_name" in data
        assert "classes" in data
        assert "confidence_threshold" in data
        if detector_service.is_loaded:
            assert data["loaded"] is True
            assert len(data["classes"]) > 0
