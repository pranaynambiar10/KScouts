from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine
import models
from routers import auth, players, events, certificates, notifications
import os
import uvicorn
import logging

# Configure logging to see failures clearly
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("kscouts")

# Create Tables
models.Base.metadata.create_all(bind=engine)

# Create uploads directory
os.makedirs("uploads/certificates", exist_ok=True)

app = FastAPI(title="KScouts API", description="Backend for KScouts Football Scouting Platform", version="0.2.0")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(players.router)
app.include_router(events.router)
app.include_router(certificates.router)
app.include_router(notifications.router)

@app.get("/")
def read_root():
    return {"message": "KScouts Backend is Online", "status": "active", "version": "0.2.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    logger.info("Starting KScouts Backend Server...")
    try:
        # Run directly to prevent background task CancelledError in some environments
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_level="info")
    except Exception as e:
        logger.error(f"Backend Server Crashed: {e}")
