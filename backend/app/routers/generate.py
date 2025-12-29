from fastapi import APIRouter, Depends, HTTPException

from app.config import Settings, get_settings
from app.models.schemas import (
    AIModel,
    ErrorResponse,
    GenerateRequest,
    GenerateResponse,
)
from app.services.gemini_service import GeminiService
from app.services.openai_service import OpenAIService

router = APIRouter(prefix="/api", tags=["generate"])


@router.post(
    "/generate",
    response_model=GenerateResponse,
    responses={500: {"model": ErrorResponse}},
)
async def generate_image(
    request: GenerateRequest,
    settings: Settings = Depends(get_settings),
) -> GenerateResponse:
    """Generate a new interior image from a text prompt."""
    try:
        if request.model == AIModel.GPT_IMAGE:
            service = OpenAIService(settings.openai_api_key)
            result = await service.generate(
                prompt=request.prompt,
                quality=request.quality.value,
                aspect_ratio=request.aspect_ratio.value,
            )
        else:
            service = GeminiService(settings.google_api_key)
            result = await service.generate(
                prompt=request.prompt,
                aspect_ratio=request.aspect_ratio.value,
            )

        return GenerateResponse(
            image_base64=result["image_base64"],
            mime_type=result.get("mime_type", "image/png"),
            description=result.get("description"),
            token_usage=result.get("token_usage"),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
