import io
import pytest
from PIL import Image
from app.services.image_processor import (
    validate_and_decode_image,
    annotate_image,
    ImageValidationError,
)


def create_test_image_bytes(format="JPEG", width=200, height=100) -> bytes:
    img = Image.new("RGB", (width, height), color=(100, 150, 200))
    buffer = io.BytesIO()
    img.save(buffer, format=format)
    return buffer.getvalue()


def test_validate_valid_jpeg():
    raw_bytes = create_test_image_bytes("JPEG", 320, 240)
    cv2_img, width, height, sha256 = validate_and_decode_image(
        file_bytes=raw_bytes,
        filename="test.jpg",
        max_bytes=10 * 1024 * 1024,
    )
    assert width == 320
    assert height == 240
    assert len(sha256) == 64
    assert cv2_img is not None


def test_validate_oversized_image():
    raw_bytes = b"0" * 200
    with pytest.raises(ImageValidationError) as exc:
        validate_and_decode_image(
            file_bytes=raw_bytes,
            filename="large.jpg",
            max_bytes=100,  # Limit is 100 bytes
        )
    assert exc.value.code == "FILE_TOO_LARGE"
    assert exc.value.status_code == 413


def test_validate_unsupported_file_extension():
    raw_bytes = create_test_image_bytes("JPEG", 100, 100)
    with pytest.raises(ImageValidationError) as exc:
        validate_and_decode_image(
            file_bytes=raw_bytes,
            filename="document.pdf",
            max_bytes=10 * 1024 * 1024,
        )
    assert exc.value.code == "INVALID_FILE_TYPE"
    assert exc.value.status_code == 415


def test_validate_corrupt_image():
    raw_bytes = b"not-a-valid-image-stream-content"
    with pytest.raises(ImageValidationError) as exc:
        validate_and_decode_image(
            file_bytes=raw_bytes,
            filename="corrupt.png",
            max_bytes=10 * 1024 * 1024,
        )
    assert exc.value.code == "INVALID_IMAGE"


def test_annotate_image():
    raw_bytes = create_test_image_bytes("JPEG", 400, 300)
    cv2_img, w, h, _ = validate_and_decode_image(raw_bytes, "site.jpg", 10 * 1024 * 1024)
    detections = [
        {
            "class_name": "brick",
            "confidence": 0.91,
            "bbox": {"x1": 50, "y1": 50, "x2": 150, "y2": 150},
        }
    ]
    b64_str = annotate_image(cv2_img, detections)
    assert isinstance(b64_str, str)
    assert len(b64_str) > 50
    # Must NOT have data URL prefix
    assert not b64_str.startswith("data:image")
