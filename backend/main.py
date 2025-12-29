from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.models.schemas import HealthResponse
from app.routers import edit, generate


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print("Starting AI Interior Image Editor API...")
    yield
    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title="AI Interior Image Editor API",
    description="Backend API for AI-powered interior design image editing",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
settings = get_settings()
origins = [origin.strip() for origin in settings.cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate.router)
app.include_router(edit.router)


@app.get("/", response_model=HealthResponse)
async def root() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="ok", version="0.1.0")


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="ok", version="0.1.0")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
