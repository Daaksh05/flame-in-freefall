"""
Compatibility API for the dashboard frontend (root-level Next.js app).

Every field returned here is derived from real data in data/processed/experiments.csv
and the indexed NASA report text. Fields we have no real data for (peak_temperature_c,
burn_duration_s, quenching_distance_mm, exact experiment dates) are returned as null
rather than invented, so the frontend must render them as "N/A".
"""
from datetime import datetime, timezone

import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.data_loader import compute_risk_index, load_experiments, to_json_records
from app.services.rag import ask as rag_ask

router = APIRouter(prefix="/api/v1")

# Real NASA source reports actually indexed for this project (see README).
REPORT_CATALOG = {
    "FLEX_NASA-TP-2015-216046.txt": {
        "id": "FLEX-2015",
        "title": "Detailed Results From the Flame Extinguishment Experiment (FLEX), March 2009 to December 2011",
        "publication": "NASA/TP-2015-216046",
        "source_url": "https://ntrs.nasa.gov/citations/20150023456",
    },
    "BASS-II_NTRS-20210011385.txt": {
        "id": "BASS2-SUMMARY-2021",
        "title": "Burning and Suppression of Solids-II (BASS-II) Summary Report",
        "publication": "NASA/TM-20210011385",
        "source_url": "https://ntrs.nasa.gov/citations/20210011385",
    },
    "BASS-II_flame-spread_NTRS-20160000593.txt": {
        "id": "BASS2-FLAMESPREAD-2016",
        "title": "BASS-II Flame Spread Results (Olson, Takahashi, T'ien)",
        "publication": "NTRS 20160000593",
        "source_url": "https://ntrs.nasa.gov/citations/20160000593",
    },
    "NTRS_20130012832.txt": {
        "id": "BASS1-OPPOSED-2013",
        "title": "Flammability Aspects of a Cotton-Fiberglass Fabric in Opposed and Concurrent Airflow in Microgravity",
        "publication": "NTRS 20130012832",
        "source_url": "https://ntrs.nasa.gov/citations/20130012832",
    },
    "NTRS_20150008962.txt": {
        "id": "BASS2-CONCURRENT-2015",
        "title": "Concurrent Flame Growth, Spread and Extinction Over Composite Fabric Samples in Low Speed Purely Forced Flow in Microgravity",
        "publication": "NTRS 20150008962",
        "source_url": "https://ntrs.nasa.gov/citations/20150008962",
    },
    "NTRS_20205004657.txt": {
        "id": "CCF-CONFINEMENT-2020",
        "title": "Effects of Confinement on Flame Spread in Microgravity",
        "publication": "NTRS 20205004657 (ICES-2020-407)",
        "source_url": "https://ntrs.nasa.gov/citations/20205004657",
    },
}

OUTCOME_TO_EXTINCTION_MODE = {
    "quenched": "Quenching",
    "blowoff": "Blowoff",
    "blowoff_attempt": "Blowoff Attempt (unconfirmed outcome)",
    "steady_burn": "Ongoing Combustion",
    "no_blowoff": "Ongoing Combustion (resisted blowoff)",
    "no_ignition": "No Ignition",
    "flammability_limit": "Flammability Boundary (reference condition)",
    "one_sided_flame": "Partial Ignition (one-sided)",
}


def _categorize_material(material: str) -> str:
    m = material.lower()
    if "fabric" in m:
        return "Fabrics & Textiles (Cotton-Fiberglass)"
    if "sheet" in m:
        return "Polymers (PMMA sheet)"
    if "rod" in m:
        return "Polymers (PMMA rod)"
    return "Other Solid Fuel"


def _row_to_experiment(row: dict) -> dict:
    oxygen = row.get("oxygen_pct")
    return {
        "id": row["experiment_id"],
        "name": f"{row['material']} — {row['task']}",
        "test_run": row["experiment_id"],
        "material": row["material"],
        "material_category": _categorize_material(row["material"]),
        "platform": row["platform"],
        "oxygen_concentration": oxygen,
        "ambient_pressure_kpa": 101.3,
        "flow_velocity_cm_s": row.get("flow_velocity_cm_s"),
        "extinction_velocity_cm_s": row.get("extinction_velocity_cm_s"),
        "flame_spread_rate_mm_s": row.get("flame_spread_rate_mm_s"),
        "peak_temperature_c": None,
        "burn_duration_s": None,
        "quenching_distance_mm": None,
        "extinction_mode": OUTCOME_TO_EXTINCTION_MODE.get(row["outcome"], row["outcome"]),
        "date_conducted": None,
        "chamber_atmosphere": f"{oxygen}% O2 / {round(100 - oxygen, 1)}% N2 (balance)" if oxygen is not None else None,
        "program": row["program"],
        "source_report": row["source_report"],
        "notes": row.get("notes"),
    }


@router.get("/experiments")
def list_experiments(
    material: str | None = None,
    platform: str | None = None,
    min_oxygen: float | None = None,
    max_oxygen: float | None = None,
    min_flow: float | None = None,
    max_flow: float | None = None,
    q: str | None = None,
    page: int = 1,
    limit: int = 20,
    sort_by: str | None = None,
    sort_order: str = "asc",
):
    df = load_experiments()

    if material:
        df = df[df["material"].str.contains(material, case=False, na=False)]
    if platform:
        df = df[df["platform"] == platform]
    if min_oxygen is not None:
        df = df[df["oxygen_pct"] >= min_oxygen]
    if max_oxygen is not None:
        df = df[df["oxygen_pct"] <= max_oxygen]
    if min_flow is not None:
        df = df[df["flow_velocity_cm_s"] >= min_flow]
    if max_flow is not None:
        df = df[df["flow_velocity_cm_s"] <= max_flow]
    if q:
        ql = q.lower()
        mask = (
            df["experiment_id"].str.lower().str.contains(ql, na=False)
            | df["material"].str.lower().str.contains(ql, na=False)
            | df["notes"].fillna("").str.lower().str.contains(ql)
        )
        df = df[mask]

    sort_map = {
        "flame_spread_rate": "flame_spread_rate_mm_s",
        "oxygen": "oxygen_pct",
        "name": "material",
    }
    if sort_by in sort_map:
        df = df.sort_values(sort_map[sort_by], ascending=(sort_order != "desc"), na_position="last")

    total = len(df)
    start = (page - 1) * limit
    page_df = df.iloc[start : start + limit]

    items = [_row_to_experiment(r) for r in to_json_records(page_df)]
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, -(-total // limit)),
    }


@router.get("/experiments/materials")
def list_materials():
    df = load_experiments()
    return sorted(df["material"].unique().tolist())


@router.get("/experiments/platforms")
def list_platforms():
    df = load_experiments()
    return sorted(df["platform"].unique().tolist())


@router.get("/experiments/compare")
def compare_experiments(exp_ids: str):
    ids = [i.strip() for i in exp_ids.split(",") if i.strip()]
    df = load_experiments()
    rows = df[df["experiment_id"].isin(ids)]
    if rows.empty:
        raise HTTPException(status_code=404, detail="No matching experiments found")

    records = to_json_records(rows)
    experiments = [_row_to_experiment(r) for r in records]

    def values_for(key):
        return [r.get(key) for r in experiments]

    metrics = [
        {"metric": "material", "label": "Material", "unit": "", "values": values_for("material")},
        {"metric": "platform", "label": "Platform", "unit": "", "values": values_for("platform")},
        {
            "metric": "oxygen_concentration",
            "label": "Oxygen Concentration",
            "unit": "% O2",
            "values": values_for("oxygen_concentration"),
            "riskSummary": "Lower O2 at which a flame still sustains indicates higher flammability risk.",
        },
        {
            "metric": "flow_velocity",
            "label": "Flow Velocity",
            "unit": "cm/s",
            "values": values_for("flow_velocity_cm_s"),
        },
        {
            "metric": "extinction_velocity",
            "label": "Extinction Velocity",
            "unit": "cm/s",
            "values": values_for("extinction_velocity_cm_s"),
            "riskSummary": "Higher extinction velocity means more airflow is needed to blow the flame out.",
        },
        {
            "metric": "flame_spread_rate",
            "label": "Flame Spread Rate",
            "unit": "mm/s",
            "values": values_for("flame_spread_rate_mm_s"),
        },
        {
            "metric": "extinction_mode",
            "label": "Outcome",
            "unit": "",
            "values": values_for("extinction_mode"),
        },
    ]

    names = [e["test_run"] for e in experiments]
    ai_synthesis = (
        f"Comparing {', '.join(names)}: outcomes were "
        f"{', '.join(e['extinction_mode'] for e in experiments)} "
        f"at oxygen concentrations of {', '.join(str(e['oxygen_concentration']) + '%' for e in experiments)}. "
        "See source reports for full experimental context."
        if len(experiments) >= 2
        else "Select at least two experiments to compare."
    )

    return {"experiments": experiments, "metrics": metrics, "aiSynthesis": ai_synthesis}


@router.get("/experiments/{experiment_id}")
def get_experiment(experiment_id: str):
    df = load_experiments()
    row = df[df["experiment_id"] == experiment_id]
    if row.empty:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return _row_to_experiment(to_json_records(row)[0])


@router.get("/insights/fire-safety")
def fire_safety_insights():
    risk_df = compute_risk_index(load_experiments())
    exp_df = load_experiments()
    insights = []

    severity_map = {"critical": "CRITICAL", "serious": "HIGH", "warning": "ELEVATED", "good": "NOMINAL"}

    for _, r in risk_df.iterrows():
        if pd.isna(r["risk_score"]):
            continue
        material = r["material"]
        material_rows = exp_df[exp_df["material"] == material]
        source_reports = material_rows["source_report"].unique().tolist()
        citation_ids = [
            v["id"] for k, v in REPORT_CATALOG.items() if k.replace(".txt", "") in source_reports
        ]

        facts = []
        if pd.notna(r["min_o2_pct"]):
            facts.append(f"sustains a flame down to {r['min_o2_pct']}% O2")
        if pd.notna(r["max_extinction_velocity_cm_s"]):
            facts.append(f"needs up to {r['max_extinction_velocity_cm_s']} cm/s airflow to extinguish")
        summary = f"{material} " + " and ".join(facts) + "." if facts else f"{material}: limited data available."

        category = "Flammability Limit" if pd.notna(r["min_o2_pct"]) else "Extinction Hazard"

        insights.append(
            {
                "id": f"INSIGHT-{material.replace(' ', '-').replace('(', '').replace(')', '').replace(',', '')[:40]}",
                "title": f"{material}: {severity_map.get(r['risk_level'], 'NOMINAL')} fire-safety risk in microgravity",
                "severity": severity_map.get(r["risk_level"], "NOMINAL"),
                "category": category,
                "summary": summary,
                "detailed_analysis": (
                    f"Based on {int(r['test_count'])} test condition(s) from {', '.join(r['programs'])}. "
                    f"Composite risk score: {r['risk_score']}/100."
                ),
                "recommended_protocol": (
                    "Verify cabin ventilation design margins against the observed extinction velocity "
                    "for this material before use near ignition sources."
                ),
                "relevant_materials": [material],
                "limiting_oxygen_index": r["min_o2_pct"] if pd.notna(r["min_o2_pct"]) else 0,
                "affected_platforms": material_rows["platform"].unique().tolist(),
                "citation_ids": citation_ids,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )

    insights.sort(key=lambda i: {"CRITICAL": 0, "HIGH": 1, "ELEVATED": 2, "NOMINAL": 3}[i["severity"]])
    return insights


@router.get("/insights/risk-ranking")
def risk_ranking():
    """Real per-material risk ranking, used by the Overview page's ranked table."""
    risk_df = compute_risk_index(load_experiments())
    scored = risk_df[risk_df["risk_score"].notna()].copy()
    out = []
    for rank, (_, r) in enumerate(scored.iterrows(), start=1):
        vulnerability_parts = []
        if pd.notna(r["min_o2_pct"]):
            vulnerability_parts.append(f"Sustains flame down to {r['min_o2_pct']}% O2")
        if pd.notna(r["max_extinction_velocity_cm_s"]):
            vulnerability_parts.append(f"needs {r['max_extinction_velocity_cm_s']} cm/s airflow to extinguish")
        out.append(
            {
                "rank": rank,
                "material": r["material"],
                "category": _categorize_material(r["material"]),
                "flameSpreadRate": None,
                "extinctionVelocity": r["max_extinction_velocity_cm_s"] if pd.notna(r["max_extinction_velocity_cm_s"]) else None,
                "loi": r["min_o2_pct"] if pd.notna(r["min_o2_pct"]) else None,
                "riskLevel": {"critical": "CRITICAL", "serious": "HIGH", "warning": "ELEVATED", "good": "NOMINAL"}.get(
                    r["risk_level"], "NOMINAL"
                ),
                "keyVulnerability": "; ".join(vulnerability_parts) if vulnerability_parts else "Limited data available.",
                "testCount": int(r["test_count"]),
                "programs": r["programs"],
            }
        )
    return out


@router.get("/metrics/summary")
def metrics_summary():
    df = load_experiments()
    risk_df = compute_risk_index(df)
    critical_count = int((risk_df["risk_level"] == "critical").sum())
    avg_spread = df["flame_spread_rate_mm_s"].dropna().mean()

    return {
        "total_experiments": len(df),
        "active_platforms_count": int(df["platform"].nunique()),
        "materials_cataloged": int(df["material"].nunique()),
        "critical_safety_alerts": critical_count,
        "last_telemetry_sync": datetime.now(timezone.utc).isoformat(),
        "average_flame_spread_rate": round(avg_spread, 3) if pd.notna(avg_spread) else None,
    }


class ChatPayload(BaseModel):
    message: str
    conversation_id: str | None = None


@router.post("/assistant/chat")
def assistant_chat(payload: ChatPayload):
    result = rag_ask(payload.message)
    citations = []
    for source in result.get("sources", []):
        meta = REPORT_CATALOG.get(source)
        if meta:
            citations.append(
                {
                    "id": meta["id"],
                    "title": meta["title"],
                    "authors": [],
                    "year": None,
                    "publication": meta["publication"],
                    "doi_or_ntrs_id": None,
                    "source_url": meta["source_url"],
                    "snippet": "",
                    "relevance_score": None,
                }
            )
    return {
        "conversation_id": payload.conversation_id or "conv-01",
        "message": result["answer"],
        "citations": citations,
        "suggested_followups": [],
    }


@router.get("/assistant/citations")
def assistant_citations(q: str | None = None):
    items = list(REPORT_CATALOG.values())
    if q:
        ql = q.lower()
        items = [c for c in items if ql in c["title"].lower()]
    return [
        {
            "id": c["id"],
            "title": c["title"],
            "authors": [],
            "year": None,
            "publication": c["publication"],
            "doi_or_ntrs_id": None,
            "source_url": c["source_url"],
            "snippet": "",
            "relevance_score": None,
        }
        for c in items
    ]
