from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag import ask, index_reports

router = APIRouter(prefix="/chat", tags=["chat"])


class Question(BaseModel):
    question: str


@router.post("")
def chat(payload: Question):
    return ask(payload.question)


@router.post("/reindex")
def reindex():
    count = index_reports()
    return {"chunks_indexed": count}
