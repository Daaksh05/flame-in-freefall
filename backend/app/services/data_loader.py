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


def to_json_records(df: pd.DataFrame) -> list[dict]:
    """Convert NaN to None so the result is valid JSON (literal NaN is not).

    Must cast to object dtype first: .where() on a float64 column silently
    coerces None back to NaN to preserve the column's dtype.
    """
    df = df.astype(object)
    return df.where(pd.notna(df), None).to_dict(orient="records")
