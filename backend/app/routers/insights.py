from fastapi import APIRouter

from app.services.data_loader import load_experiments, rank_by_extinction_velocity, to_json_records

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/ranking")
def hardest_to_extinguish(limit: int = 10):
    """Experiments requiring the most flow to extinguish — a proxy for fire-safety risk."""
    df = rank_by_extinction_velocity(load_experiments())
    df = df[df["extinction_velocity_cm_s"].notna()]
    return to_json_records(df.head(limit))


@router.get("/summary")
def summary():
    df = load_experiments()
    return {
        "total_experiments": len(df),
        "programs": sorted(df["program"].unique().tolist()),
        "materials": sorted(df["material"].unique().tolist()),
        "avg_extinction_velocity_cm_s": round(df["extinction_velocity_cm_s"].dropna().mean(), 3),
        "extinguished_rate_pct": round(df["extinguished"].mean() * 100, 1),
    }
