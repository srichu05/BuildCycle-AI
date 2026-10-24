from app.services.recovery import get_recommendations_for_materials, RECOVERY_RULES, FALLBACK_RULE


def test_recovery_known_materials():
    materials = ["concrete", "brick", "timber", "plastic"]
    recs = get_recommendations_for_materials(materials)

    assert len(recs) == 4
    materials_found = [r["material"] for r in recs]
    assert "concrete" in materials_found
    assert "brick" in materials_found
    assert "timber" in materials_found
    assert "plastic" in materials_found

    # Check that concrete recommendation specifies aggregate recovery
    concrete_rec = next(r for r in recs if r["material"] == "concrete")
    assert concrete_rec["pathway"] == "aggregate_recovery"


def test_recovery_unknown_material_fallback():
    recs = get_recommendations_for_materials(["mystery_material_xyz"])
    assert len(recs) == 1
    assert recs[0]["material"] == "mystery_material_xyz"
    assert recs[0]["pathway"] == "assessment_required"
    assert "Image classification alone does not establish" in recs[0]["caution"]


def test_recovery_deduplication():
    recs = get_recommendations_for_materials(["brick", "Brick", "BRICK"])
    assert len(recs) == 1
    assert recs[0]["material"] == "brick"
