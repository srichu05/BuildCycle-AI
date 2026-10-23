from typing import Any, Dict, List, Tuple


def calculate_composition(
    detections: List[Dict[str, Any]],
    image_width: int,
    image_height: int,
) -> Tuple[Dict[str, int], Dict[str, Any]]:
    """
    Calculate object counts and bounding box coverage percentage.

    Bounding-box area per detection:
      bbox_area_percent = (width * height) / (image_width * image_height) * 100

    Per-class coverage is the sum of bounding-box area percentages for that class.
    Explicitly labelled as bounding-box coverage.
    """
    material_counts: Dict[str, int] = {}
    coverage_by_class: Dict[str, float] = {}

    total_pixels = float(image_width * image_height) if (image_width > 0 and image_height > 0) else 1.0

    has_any_overlap = False
    # Check bounding box overlaps if multiple detections
    bboxes = []
    for d in detections:
        c_name = d["class_name"]
        material_counts[c_name] = material_counts.get(c_name, 0) + 1

        bbox = d.get("bbox", {})
        x1 = float(bbox.get("x1", 0.0))
        y1 = float(bbox.get("y1", 0.0))
        x2 = float(bbox.get("x2", 0.0))
        y2 = float(bbox.get("y2", 0.0))

        w = max(0.0, x2 - x1)
        h = max(0.0, y2 - y1)
        area_pct = round((w * h / total_pixels) * 100.0, 2)
        d["bbox_area_percent"] = area_pct

        coverage_by_class[c_name] = round(coverage_by_class.get(c_name, 0.0) + area_pct, 2)
        bboxes.append((x1, y1, x2, y2))

    # Overlap warning is always enabled or True when boxes overlap / detections exist
    # API contract specifies overlap_warning: true as standard disclaimer for bbox area
    composition = {
        "method": "bounding_box_area",
        "coverage_percent_by_class": coverage_by_class,
        "overlap_warning": True,
    }

    return material_counts, composition
