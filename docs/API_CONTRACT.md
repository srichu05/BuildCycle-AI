# API Contract — `/api/v1`

This contract is shared with the separately built React frontend. Do not rename fields or endpoints without updating this file and coordinating the frontend.

## Base URL
Local: `http://localhost:8000`
Production: backend Render URL.
Frontend reads `VITE_API_BASE_URL` and appends endpoint paths.

## 1. `GET /api/v1/health/live`
Purpose: process liveness; must not require database/model.
Success `200`:
```json
{"status":"ok"}
```

## 2. `GET /api/v1/health/ready`
Purpose: check required runtime readiness. Check DB connectivity; include model readiness if model loading is mandatory.
Success `200`:
```json
{"status":"ready","database":"ok","model":"ready"}
```
Not ready: `503` with standard error object. Avoid leaking credentials or stack traces.

## 3. `GET /api/v1/model/status`
Success `200`:
```json
{
  "loaded": true,
  "model_name": "construction-waste-yolo",
  "model_version": "configured-or-unknown",
  "task": "detect",
  "classes": ["brick", "concrete", "plastic", "reinforcement_steel", "timber"],
  "confidence_threshold": 0.25
}
```
Class list must come from loaded weights. If the actual weights use different names, return the actual names. Do not hardcode this example as model truth.

## 4. `POST /api/v1/analyses`
Content type: `multipart/form-data`; field `file` required. Optional `confidence_threshold` only if explicitly supported and range-validated; MVP can use server config only.
Accepted file formats: JPEG/JPG and PNG. Max size default 10 MB. Decode and verify the actual image; do not trust filename/MIME alone.
Success `200` (or `201` if created resource convention is chosen; choose one and keep consistent):
```json
{
  "analysis_id": "uuid",
  "status": "completed",
  "image": {"filename": "site.jpg", "width": 1280, "height": 720},
  "model": {"name": "construction-waste-yolo", "version": "configured-or-unknown", "task": "detect"},
  "summary": {
    "total_objects": 3,
    "material_counts": {"concrete": 1, "brick": 1, "timber": 1}
  },
  "detections": [
    {
      "class_name": "concrete",
      "confidence": 0.93,
      "bbox": {"x1": 100, "y1": 120, "x2": 340, "y2": 310},
      "bbox_area_percent": 4.96
    }
  ],
  "composition": {
    "method": "bounding_box_area",
    "coverage_percent_by_class": {"concrete": 4.96},
    "overlap_warning": true
  },
  "recommendations": [
    {
      "material": "concrete",
      "pathway": "aggregate_recovery",
      "title": "Consider concrete recycling",
      "description": "Concrete may be suitable for crushing and aggregate recovery after contaminant and suitability checks.",
      "caution": "Confirm local requirements and material condition."
    }
  ],
  "annotated_image_base64": "BASE64_ENCODED_JPEG_WITHOUT_DATA_URL_PREFIX",
  "inference_time_ms": 420
}
```
All numbers above are examples only. `annotated_image_base64` should be base64 without a data URL prefix; frontend can construct a `data:image/jpeg;base64,...` URL. If payload size is a concern, return an optional field or use a separate response mechanism, but coordinate changes before coding.

### Detection semantics
- `bbox` uses pixel coordinates in the original image coordinate system.
- `confidence` is a float from 0 to 1.
- `bbox_area_percent = bbox width * bbox height / (image width * image height) * 100`.
- Per-class coverage is the sum of bounding-box area percentages for that class; cap display at 100 only if explicitly labelled, but preferably preserve raw summed coverage and set overlap warning.
- Bounding boxes overlap and include background. Do not call this true material area, mass, weight, volume, or recycling percentage.
- `total_objects` equals length of `detections`.
- `material_counts` derives from detections, not a separate guessed estimate.

## 5. `GET /api/v1/analyses`
Pagination: `limit` default 20, max 100; `offset` default 0.
Response:
```json
{
  "items": [
    {
      "analysis_id": "uuid",
      "created_at": "2026-10-23T08:00:00Z",
      "original_filename": "site.jpg",
      "total_detections": 3,
      "model_name": "construction-waste-yolo"
    }
  ],
  "limit": 20,
  "offset": 0,
  "total": 1
}
```

## 6. `GET /api/v1/analyses/{analysis_id}`
Returns the saved analysis and detection records in the same shape as the analysis response, except the annotated image may be null because images are not persisted.

## 7. `GET /api/v1/analyses/{analysis_id}/report.csv`
Returns `text/csv` with a header and one row per detection. Include analysis ID, filename, created timestamp, class, confidence, x1/y1/x2/y2 and bbox area percentage. For zero detections, return a valid CSV with headers.
Use safe CSV generation and avoid spreadsheet formula injection for untrusted filename/class strings.

## Error format
```json
{
  "error": {
    "code": "INVALID_IMAGE",
    "message": "The uploaded file is not a supported, valid image."
  }
}
```
Expected codes include `INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `INVALID_IMAGE`, `MODEL_NOT_READY`, `DATABASE_UNAVAILABLE`, `ANALYSIS_NOT_FOUND`, `INFERENCE_FAILED`, and `INTERNAL_ERROR`.
Use suitable HTTP status codes: 400/413/415 for invalid uploads, 404 for missing analysis, 503 for readiness/model/DB unavailability, 500 for unexpected internal errors. Never return stack traces or secrets.
