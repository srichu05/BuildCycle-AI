from app.services.composition import calculate_composition


def test_calculate_composition_empty():
    counts, comp = calculate_composition([], 1000, 1000)
    assert counts == {}
    assert comp["method"] == "bounding_box_area"
    assert comp["coverage_percent_by_class"] == {}
    assert comp["overlap_warning"] is True


def test_calculate_composition_with_detections():
    detections = [
        {
            "class_name": "concrete",
            "confidence": 0.95,
            "bbox": {"x1": 0.0, "y1": 0.0, "x2": 100.0, "y2": 100.0},
        },
        {
            "class_name": "brick",
            "confidence": 0.88,
            "bbox": {"x1": 200.0, "y1": 200.0, "x2": 400.0, "y2": 300.0},
        },
        {
            "class_name": "concrete",
            "confidence": 0.75,
            "bbox": {"x1": 500.0, "y1": 500.0, "x2": 600.0, "y2": 600.0},
        },
    ]
    # Image 1000 x 1000 = 1,000,000 pixels
    # concrete 1: 100 * 100 = 10,000 = 1.00%
    # brick 1: 200 * 100 = 20,000 = 2.00%
    # concrete 2: 100 * 100 = 10,000 = 1.00%
    # total concrete: 2.00%
    counts, comp = calculate_composition(detections, 1000, 1000)

    assert counts == {"concrete": 2, "brick": 1}
    assert comp["coverage_percent_by_class"]["concrete"] == 2.00
    assert comp["coverage_percent_by_class"]["brick"] == 2.00
    assert detections[0]["bbox_area_percent"] == 1.00
    assert detections[1]["bbox_area_percent"] == 2.00
