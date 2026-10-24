import logging
import os
import time
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
from app.core.config import settings

logger = logging.getLogger(__name__)

# Canonical mapping for standard construction-waste YOLO classes
CANONICAL_CLASS_MAP = {
    "brick": "brick",
    "concrete": "concrete",
    "plasticbottle": "plastic",
    "plastic_bottle": "plastic",
    "plastic": "plastic",
    "reinforcement": "reinforcement_steel",
    "reinforcement_steel": "reinforcement_steel",
    "timber": "timber",
    "wood": "wood",
    "stone": "stone",
    "tile": "tile",
    "foam": "foam",
    "pipes": "pipes",
    "gypsum_board": "gypsum_board",
    "general_w": "general_w",
}


class ModelNotReadyError(Exception):
    def __init__(self, message: str = "Model weights are not loaded or not ready."):
        self.code = "MODEL_NOT_READY"
        self.message = message
        self.status_code = 503
        super().__init__(message)


class InferenceFailedError(Exception):
    def __init__(self, message: str = "Failed to run model inference on the provided image."):
        self.code = "INFERENCE_FAILED"
        self.message = message
        self.status_code = 500
        super().__init__(message)


class DetectorService:
    def __init__(self):
        self.model = None
        self.is_loaded = False
        self.load_error: Optional[str] = None
        self.task: str = "detect"
        self.model_version: str = "v8l"
        self.raw_classes: List[str] = []
        self.classes: List[str] = []

    def load_model(self) -> bool:
        """Load YOLO model weights once at startup."""
        model_path = settings.MODEL_PATH
        if not os.path.exists(model_path):
            self.is_loaded = False
            self.load_error = f"Model weights file not found at: {model_path}"
            logger.warning(self.load_error)
            return False

        try:
            from ultralytics import YOLO
            import torch

            # Optimize thread pool for constrained CPU environments (e.g. Render Free)
            try:
                torch.set_num_threads(min(2, os.cpu_count() or 1))
            except Exception:
                pass

            logger.info(f"Loading YOLO model weights from {model_path}...")
            self.model = YOLO(model_path)
            self.task = getattr(self.model, "task", "detect") or "detect"
            
            # Extract classes from loaded model metadata
            names = getattr(self.model, "names", {})
            if isinstance(names, dict):
                self.raw_classes = [names[k] for k in sorted(names.keys())]
            elif isinstance(names, list):
                self.raw_classes = list(names)
            else:
                self.raw_classes = []

            # Normalize class names to canonical lowercased identifiers
            canonical_classes = []
            for name in self.raw_classes:
                normalized = name.strip().lower().replace(" ", "_")
                canonical = CANONICAL_CLASS_MAP.get(normalized, normalized)
                canonical_classes.append(canonical)
            self.classes = canonical_classes

            self.is_loaded = True
            self.load_error = None
            logger.info(f"Model successfully loaded. Task: {self.task}, Classes: {self.classes}")
            return True
        except Exception as e:
            self.model = None
            self.is_loaded = False
            self.load_error = f"Failed to load model from {model_path}: {str(e)}"
            logger.error(self.load_error)
            return False

    def get_status(self) -> Dict[str, Any]:
        """Return model metadata for status and health endpoints."""
        return {
            "loaded": self.is_loaded,
            "model_name": settings.MODEL_NAME,
            "model_version": self.model_version if self.is_loaded else "unknown",
            "task": self.task,
            "classes": self.classes if self.is_loaded else [],
            "confidence_threshold": settings.MODEL_CONFIDENCE_THRESHOLD,
            "error": self.load_error,
        }

    def predict(
        self,
        image: np.ndarray,
        confidence_threshold: Optional[float] = None,
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Run inference synchronously on a decoded image (numpy BGR array).
        Returns: (detections, inference_duration_ms)
        """
        if not self.is_loaded or self.model is None:
            raise ModelNotReadyError(
                self.load_error or "Model is not loaded. Verify MODEL_PATH configuration."
            )

        conf = confidence_threshold if confidence_threshold is not None else settings.MODEL_CONFIDENCE_THRESHOLD
        iou = settings.MODEL_IOU_THRESHOLD

        import torch

        start_time = time.perf_counter()
        try:
            with torch.inference_mode():
                results = self.model.predict(
                    image,
                    imgsz=640,
                    device="cpu",
                    conf=conf,
                    iou=iou,
                    verbose=False,
                )
        except Exception as e:
            logger.error(f"Inference error: {str(e)}")
            raise InferenceFailedError(f"Model inference failed: {str(e)}")

        duration_ms = int((time.perf_counter() - start_time) * 1000)

        detections: List[Dict[str, Any]] = []
        if not results:
            return detections, duration_ms

        r = results[0]
        boxes = getattr(r, "boxes", None)
        if boxes is None or len(boxes) == 0:
            return detections, duration_ms

        names = self.model.names
        for box in boxes:
            cls_id = int(box.cls[0].item())
            raw_cls_name = names.get(cls_id, str(cls_id))
            normalized = str(raw_cls_name).strip().lower().replace(" ", "_")
            canonical_name = CANONICAL_CLASS_MAP.get(normalized, normalized)

            confidence = round(float(box.conf[0].item()), 2)
            xyxy = box.xyxy[0].tolist()

            detections.append({
                "class_name": canonical_name,
                "confidence": confidence,
                "bbox": {
                    "x1": round(float(xyxy[0]), 1),
                    "y1": round(float(xyxy[1]), 1),
                    "x2": round(float(xyxy[2]), 1),
                    "y2": round(float(xyxy[3]), 1),
                },
                "bbox_area_percent": 0.0,  # Will be populated by composition service
            })

        return detections, duration_ms


# Global singleton detector instance
detector_service = DetectorService()
