from app.api.v1.reports import sanitize_csv_cell


def test_sanitize_csv_cell():
    # Dangerous formula characters should be prepended with a single quote
    assert sanitize_csv_cell("=1+1") == "'=1+1"
    assert sanitize_csv_cell("+cmd|' /C calc'!A0") == "'+cmd|' /C calc'!A0"
    assert sanitize_csv_cell("-5+2") == "'-5+2"
    assert sanitize_csv_cell("@SUM(A1:A10)") == "'@SUM(A1:A10)"
    assert sanitize_csv_cell("\tTab") == "'\tTab"

    # Normal strings should remain unchanged
    assert sanitize_csv_cell("concrete") == "concrete"
    assert sanitize_csv_cell("site_photo_12.jpg") == "site_photo_12.jpg"
    assert sanitize_csv_cell(None) == ""
