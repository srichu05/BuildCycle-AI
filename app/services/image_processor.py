import base64
import hashlib
import io
from typing import Any, Dict, List, Tuple
import cv2
import numpy as np
from PIL import Image

# Palette of distinct, modern colors for classes (BGR format for OpenCV)
CLASS_COLORS = [
    (46, 204, 113),   # Emerald green
    (52, 152, 219),   # Peter river blue
    (155, 89, 182),   # Amethyst purple
    (241, 196, 15),   # Sun yellow
    (230, 126, 34),   # Carrot orange
    (231, 76, 60),    # Alizarin red
    (26, 188, 156),   # Turquoise
    (52, 73, 94),     # Wet asphalt dark blue
    (243, 156, 18),   # Orange
    (142, 68, 173),   # Wisteria
]


class ImageValidationError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def validate_and_decode_image(
    file_bytes: bytes,
    filename: str,
    max_bytes: int,
) -> Tuple[np.ndarray, int, int, str]:
    """
    Validate file size, extension, and decodability.
    Returns: (cv2_image_bgr, width, height, sha256_hash)
    """
    if len(file_bytes) > max_bytes:
        raise ImageValidationError(
            code="FILE_TOO_LARGE",
            message=f"File size exceeds maximum allowed limit of {max_bytes // (1024 * 1024)} MB.",
            status_code=413,
        )

    lower_name = filename.lower()
    allowed_exts = (".jpg", ".jpeg", ".png")
    if not any(lower_name.endswith(ext) for ext in allowed_exts):
        raise ImageValidationError(
            code="INVALID_FILE_TYPE",
            message="Only JPEG (.jpg, .jpeg) and PNG (.png) images are supported.",
            status_code=415,
        )

    # Compute sha256
    sha256 = hashlib.sha256(file_bytes).hexdigest()

    # Verify Pillow can open and verify image integrity
    try:
        pil_img = Image.open(io.BytesIO(file_bytes))
        pil_img.verify()
    except Exception:
        raise ImageValidationError(
            code="INVALID_IMAGE",
            message="The uploaded file is not a supported, valid image or is corrupted.",
            status_code=400,
        )

    # Re-open for decoding with OpenCV
    nparr = np.frombuffer(file_bytes, np.uint8)
    cv2_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if cv2_img is None or cv2_img.size == 0:
        raise ImageValidationError(
            code="INVALID_IMAGE",
            message="Unable to decode image data into pixels.",
            status_code=400,
        )

    height, width = cv2_img.shape[:2]
    if width <= 0 or height <= 0:
        raise ImageValidationError(
            code="INVALID_IMAGE",
            message="Image has invalid dimensions.",
            status_code=400,
        )

    return cv2_img, width, height, sha256


def annotate_image(
    image: np.ndarray,
    detections: List[Dict[str, Any]],
) -> str:
    """
    Draw bounding boxes and class labels with confidences on the image.
    Returns the annotated image as a base64 string without data URL prefix.
    """
    annotated = image.copy()
    h, w = annotated.shape[:2]

    # Map class names to colors deterministically
    unique_classes: Dict[str, Tuple[int, int, int]] = {}

    for det in detections:
        c_name = det["class_name"]
        if c_name not in unique_classes:
            idx = len(unique_classes) % len(CLASS_COLORS)
            unique_classes[c_name] = CLASS_COLORS[idx]
        color = unique_classes[c_name]

        bbox = det["bbox"]
        x1 = int(round(bbox["x1"]))
        y1 = int(round(bbox["y1"]))
        x2 = int(round(bbox["x2"]))
        y2 = int(round(bbox["y2"]))

        # Clamp coordinates to image boundaries
        x1 = max(0, min(w - 1, x1))
        y1 = max(0, min(h - 1, y1))
        x2 = max(0, min(w - 1, x2))
        y2 = max(0, min(h - 1, y2))

        conf = det.get("confidence", 0.0)
        label = f"{c_name} {conf:.2f}"

        # Draw bounding box
        thickness = max(2, int(min(w, h) / 300))
        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, thickness)

        # Label background pill
        font_scale = max(0.5, min(w, h) / 1000.0)
        font_thickness = max(1, int(font_scale * 2))
        (text_w, text_h), baseline = cv2.getTextSize(
            label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness
        )

        label_y1 = max(0, y1 - text_h - baseline - 4)
        label_y2 = y1
        label_x2 = min(w, x1 + text_w + 8)

        # Background rectangle for text
        cv2.rectangle(
            annotated,
            (x1, label_y1),
            (label_x2, label_y2),
            color,
            cv2.FILLED,
        )

        # Draw white text
        cv2.putText(
            annotated,
            label,
            (x1 + 4, label_y2 - baseline - 2),
            cv2.FONT_HERSHEY_SIMPLEX,
            font_scale,
            (255, 255, 255),
            font_thickness,
            cv2.LINE_AA,
        )

    # Encode as JPEG
    encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
    success, buffer = cv2.imencode(".jpg", annotated, encode_params)
    if not success:
        return ""

    # Return base64 string WITHOUT data:image/jpeg;base64, prefix
    return base64.b64encode(buffer).decode("utf-8")
