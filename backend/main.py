from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import upload, actions
from dotenv import load_dotenv
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NyayTrack API",
    description="AI-Powered Court Order Compliance Engine - Powered by NVIDIA NIM",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(actions.router, prefix="/api", tags=["Actions"])

@app.get("/")
def root():
    return {
        "message": "Welcome to NyayTrack API",
        "status": "running",
        "ai_engine": os.getenv("NVIDIA_MODEL")
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "app": os.getenv("APP_NAME"),
        "model": os.getenv("NVIDIA_MODEL")
    }