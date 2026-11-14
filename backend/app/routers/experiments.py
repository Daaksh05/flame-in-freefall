from fastapi import APIRouter, HTTPException

from app.services.data_loader import load_experiments, to_json_records

router = APIRouter(prefix="/experiments", tags=["experiments"])


@router.get("")
def list_experiments(
    material: str | None = None,
    platform: str | None = None,
    gravity_level: str | None = None,
):
    df = load_experiments()
    if material:
        df = df[df["material"].str.contains(material, case=False)]
    if platform:
        df = df[df["platform"].str.contains(platform, case=False)]
    if gravity_level:
        df = df[df["gravity_level"] == gravity_level]
    return to_json_records(df)


@router.get("/{experiment_id}")
def get_experiment(experiment_id: str):
    df = load_experiments()
    row = df[df["experiment_id"] == experiment_id]
    if row.empty:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return to_json_records(row)[0]


@router.post("/compare")
def compare_experiments(experiment_ids: list[str]):
    df = load_experiments()
    rows = df[df["experiment_id"].isin(experiment_ids)]
    return to_json_records(rows)
