import csv
import io
import uuid
from typing import Any
from fastapi import APIRouter, Response, status
from fastapi.responses import JSONResponse
from app.db.session import get_session_factory
from app.db.repositories import get_analysis_by_id

router = APIRouter()


def sanitize_csv_cell(value: Any) -> str:
    """
    Sanitize text cell to prevent CSV / Spreadsheet formula injection.
    Prefix characters =, +, -, @, or tab/CR with a single quote.
    """
    if value is None:
        return ""
    text_val = str(value)
    if text_val and text_val[0] in ("=", "+", "-", "@", "\t", "\r"):
        return f"'{text_val}"
    return text_val


@router.get("/{analysis_id}/report.csv")
def export_analysis_csv(analysis_id: str):
    """
    Generate and return a CSV export for a specific analysis.
    For zero detections, a valid CSV with headers is returned.
    """
    try:
        target_uuid = uuid.UUID(analysis_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "error": {
                    "code": "ANALYSIS_NOT_FOUND",
                    "message": f"Analysis with ID '{analysis_id}' was not found.",
                }
            },
        )

    session_factory = get_session_factory()
    if session_factory is None:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": "DATABASE_URL is not configured.",
                }
            },
        )

    try:
        db = session_factory()
        try:
            analysis = get_analysis_by_id(db=db, analysis_id=target_uuid)
            if not analysis:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={
                        "error": {
                            "code": "ANALYSIS_NOT_FOUND",
                            "message": f"Analysis with ID '{analysis_id}' was not found.",
                        }
                    },
                )

            output = io.StringIO()
            fieldnames = [
                "analysis_id",
                "original_filename",
                "created_at",
                "class_name",
                "confidence",
                "x1",
                "y1",
                "x2",
                "y2",
                "bbox_area_percent",
            ]
            writer = csv.DictWriter(output, fieldnames=fieldnames, lineterminator="\n")
            writer.writeheader()

            created_iso = analysis.created_at.isoformat() if analysis.created_at else ""
            clean_filename = sanitize_csv_cell(analysis.original_filename)

            for det in analysis.detections:
                writer.writerow({
                    "analysis_id": str(analysis.id),
                    "original_filename": clean_filename,
                    "created_at": created_iso,
                    "class_name": sanitize_csv_cell(det.class_name),
                    "confidence": f"{det.confidence:.2f}",
                    "x1": f"{det.x1:.1f}",
                    "y1": f"{det.y1:.1f}",
                    "x2": f"{det.x2:.1f}",
                    "y2": f"{det.y2:.1f}",
                    "bbox_area_percent": f"{det.bbox_area_percent:.2f}" if det.bbox_area_percent is not None else "0.00",
                })

            csv_content = output.getvalue()
            return Response(
                content=csv_content,
                media_type="text/csv",
                headers={
                    "Content-Disposition": f'attachment; filename="analysis_{analysis_id}.csv"',
                },
            )
        finally:
            db.close()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": f"Database query failed: {str(e)}",
                }
            },
        )
