from fastapi import APIRouter

from app.services.data_loader import load_experiments, rank_by_flame_spread

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/ranking")
def flame_spread_ranking(limit: int = 10):
    df = rank_by_flame_spread(load_experiments())
    return df.head(limit).to_dict(orient="records")


@router.get("/summary")
def summary():
    df = load_experiments()
    return {
        "total_experiments": len(df),
        "programs": sorted(df["program"].unique().tolist()),
        "materials": sorted(df["material"].unique().tolist()),
        "avg_flame_spread_rate_mm_s": round(df["flame_spread_rate_mm_s"].mean(), 3),
        "extinguished_rate_pct": round(df["extinguished"].mean() * 100, 1),
    }
