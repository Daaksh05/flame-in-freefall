from functools import lru_cache
from pathlib import Path

import pandas as pd

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "processed" / "experiments.csv"


@lru_cache
def load_experiments() -> pd.DataFrame:
    return pd.read_csv(DATA_PATH)


def rank_by_flame_spread(df: pd.DataFrame) -> pd.DataFrame:
    return df.sort_values("flame_spread_rate_mm_s", ascending=False)
