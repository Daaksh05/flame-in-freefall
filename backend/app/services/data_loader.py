from functools import lru_cache
from pathlib import Path

import pandas as pd

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "processed" / "experiments.csv"


@lru_cache
def load_experiments() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    df["extinguished"] = df["outcome"].isin(["quenched", "blowoff"])
    return df


def rank_by_extinction_velocity(df: pd.DataFrame) -> pd.DataFrame:
    """Higher extinction velocity = more flow needed to blow the flame out = harder to extinguish."""
    return df.sort_values("extinction_velocity_cm_s", ascending=False, na_position="last")


def compute_risk_index(df: pd.DataFrame) -> pd.DataFrame:
    """Composite fire-safety risk score per material.

    Two independent hazard signals, each normalized 0-1 across materials:
      - flammability: inverse of the lowest O2% at which the material still
        sustains a flame (lower O2 limit = more dangerous, burns more easily)
      - persistence: the highest extinction velocity observed (more flow
        needed to blow the flame out = harder to extinguish = more dangerous)

    A material missing one signal is scored on the other alone (weights
    renormalize per-row) rather than penalized for missing data.
    """
    sustains_flame = df["outcome"].isin(
        ["steady_burn", "blowoff", "blowoff_attempt", "flammability_limit", "one_sided_flame"]
    )
    by_material = df.groupby("material").agg(
        min_o2_pct=("oxygen_pct", lambda s: df.loc[s.index, "oxygen_pct"][sustains_flame.loc[s.index]].min()),
        max_extinction_velocity_cm_s=("extinction_velocity_cm_s", "max"),
        test_count=("experiment_id", "count"),
        programs=("program", lambda s: sorted(s.unique().tolist())),
    ).reset_index()

    def normalize(series: pd.Series, invert: bool = False) -> pd.Series:
        lo, hi = series.min(), series.max()
        if pd.isna(lo) or pd.isna(hi) or hi == lo:
            return pd.Series(0.5, index=series.index).where(series.notna())
        norm = (series - lo) / (hi - lo)
        return (1 - norm) if invert else norm

    flammability = normalize(by_material["min_o2_pct"], invert=True)
    persistence = normalize(by_material["max_extinction_velocity_cm_s"], invert=False)

    weighted_sum = flammability.fillna(0) * 0.6 + persistence.fillna(0) * 0.4
    weight_total = flammability.notna() * 0.6 + persistence.notna() * 0.4
    by_material["risk_score"] = (weighted_sum / weight_total.replace(0, pd.NA) * 100).round(1)

    by_material = by_material.sort_values("risk_score", ascending=False, na_position="last")

    def bucket(score: float) -> str:
        if pd.isna(score):
            return "unknown"
        if score >= 75:
            return "critical"
        if score >= 50:
            return "serious"
        if score >= 25:
            return "warning"
        return "good"

    by_material["risk_level"] = by_material["risk_score"].apply(bucket)
    return by_material


def to_json_records(df: pd.DataFrame) -> list[dict]:
    """Convert NaN to None so the result is valid JSON (literal NaN is not).

    Must cast to object dtype first: .where() on a float64 column silently
    coerces None back to NaN to preserve the column's dtype.
    """
    df = df.astype(object)
    return df.where(pd.notna(df), None).to_dict(orient="records")
