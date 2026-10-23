from typing import Any, Dict, List, Set

# Deterministic recovery guidelines for construction and demolition materials
RECOVERY_RULES: Dict[str, Dict[str, str]] = {
    "concrete": {
        "material": "concrete",
        "pathway": "aggregate_recovery",
        "title": "Consider concrete recycling",
        "description": "Concrete may be suitable for crushing and aggregate recovery after contaminant and suitability checks.",
        "caution": "Confirm local requirements and material condition. Image classification does not establish structural safety.",
    },
    "brick": {
        "material": "brick",
        "pathway": "salvage_and_aggregate",
        "title": "Brick salvage or aggregate recovery",
        "description": "Intact bricks can potentially be cleaned and reused for masonry; damaged bricks may be crushed for landscaping or road sub-base.",
        "caution": "Inspect for mortar adhesion, hazardous coatings, and structural integrity.",
    },
    "timber": {
        "material": "timber",
        "pathway": "reuse_and_wood_recycling",
        "title": "Timber reuse or wood recycling",
        "description": "Dimensional lumber may be salvaged for reuse or architectural features; clean timber can be chipped for engineered wood or mulch.",
        "caution": "Check for chemical treatments (CCA/creosote), embedded fasteners, and fungal rot.",
    },
    "wood": {
        "material": "wood",
        "pathway": "reuse_and_wood_recycling",
        "title": "Wood salvage or recycling",
        "description": "Clean untreated wood fragments can be reclaimed or ground into woodchips, particleboard feedstock, or bio-composite filler.",
        "caution": "Verify absence of lead paint, chemical preservatives, or hazardous binders.",
    },
    "reinforcement_steel": {
        "material": "reinforcement_steel",
        "pathway": "scrap_metal_recovery",
        "title": "Ferrous scrap-metal recycling",
        "description": "Reinforcing steel has high market recyclability and should be segregated for magnetic separation and smelting.",
        "caution": "Handle sharp edges safely; separate from adhering concrete chunks where feasible.",
    },
    "reinforcement": {
        "material": "reinforcement",
        "pathway": "scrap_metal_recovery",
        "title": "Steel rebar recovery",
        "description": "Reinforcing steel has high market recyclability and should be segregated for magnetic separation and smelting.",
        "caution": "Handle sharp edges safely; separate from adhering concrete chunks where feasible.",
    },
    "plastic": {
        "material": "plastic",
        "pathway": "polymer_recycling",
        "title": "Plastic polymer recycling",
        "description": "Construction plastics (e.g., HDPE, PVC conduits, LDPE sheeting) may be recycled depending on polymer identification and wash cleanliness.",
        "caution": "Segregate by resin code; heavily soiled or degraded plastics may require specialized processing.",
    },
    "tile": {
        "material": "tile",
        "pathway": "ceramic_aggregate",
        "title": "Ceramic tile salvage or crushing",
        "description": "Undamaged ceramic and porcelain tiles may be salvaged; broken tiles can be crushed for decorative aggregate or trench backfill.",
        "caution": "Remove adhesive/grout backing; verify absence of hazardous historic glazes.",
    },
    "stone": {
        "material": "stone",
        "pathway": "masonry_reuse",
        "title": "Natural stone salvage and repurposing",
        "description": "Natural stone elements are durable and high-value for landscaping, retaining walls, or gabions.",
        "caution": "Assess block stability, weight limits, and contamination before re-laying.",
    },
    "pipes": {
        "material": "pipes",
        "pathway": "conduit_segregation",
        "title": "Pipe segregation and recycling",
        "description": "Metallic and rigid PVC/HDPE pipes can be separated into dedicated mechanical recycling streams.",
        "caution": "Ensure pipes are purged of residual fluids and free of hazardous insulation or lead solder.",
    },
    "foam": {
        "material": "foam",
        "pathway": "insulation_recovery",
        "title": "Insulation foam handling",
        "description": "Rigid insulation foams (EPS/XPS) may have specialized recycling pathways if uncontaminated.",
        "caution": "Verify flame retardant additives and keep dry; avoid airborne dust during compaction.",
    },
    "gypsum_board": {
        "material": "gypsum_board",
        "pathway": "gypsum_recycling",
        "title": "Drywall and gypsum recovery",
        "description": "Clean drywall cutoffs can be crushed to reclaim gypsum powder for new drywall manufacture or soil amendment.",
        "caution": "Must be kept dry; water damage, mold, or demolition debris can cause hydrogen sulfide formation in landfills.",
    },
    "general_w": {
        "material": "general_w",
        "pathway": "manual_sorting",
        "title": "Mixed construction waste segregation",
        "description": "Commingled debris requires sorting at a licensed materials recovery facility (MRF) to extract salvageable fractions.",
        "caution": "Assume low purity until screened; do not dispose in uncertified facilities.",
    },
}

FALLBACK_RULE = {
    "material": "unknown",
    "pathway": "assessment_required",
    "title": "Manual assessment required",
    "description": "Unclassified or unknown waste fraction. Onsite inspection and testing recommended to evaluate recovery potential.",
    "caution": "Image classification alone does not establish material purity, structural safety, or certified recyclability.",
}


def get_recommendations_for_materials(material_names: List[str]) -> List[Dict[str, str]]:
    """
    Generate deterministic recommendations for recognized materials.
    Returns at most one recommendation per distinct material class present.
    """
    seen: Set[str] = set()
    recommendations: List[Dict[str, str]] = []

    for mat in material_names:
        clean_mat = mat.strip().lower()
        if clean_mat in seen:
            continue
        seen.add(clean_mat)

        if clean_mat in RECOVERY_RULES:
            recommendations.append(RECOVERY_RULES[clean_mat])
        else:
            fallback = dict(FALLBACK_RULE)
            fallback["material"] = clean_mat
            recommendations.append(fallback)

    return recommendations
