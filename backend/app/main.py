from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chat, experiments, insights

app = FastAPI(title="Flame in Freefall API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(experiments.router)
app.include_router(insights.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "flame-in-freefall-api"}
