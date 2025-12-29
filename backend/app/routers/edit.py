from fastapi import APIRouter, Depends, HTTPException

from app.config import Settings, get_settings
from app.models.schemas import (
    AIModel,
    EditRequest,
    EditResponse,
    SemanticEditRequest,
)
from app.services.gemini_service import GeminiService
from app.services.openai_service import OpenAIService

router = APIRouter(prefix="/api", tags=["edit"])


@router.post(
    "/edit",
    response_model=EditResponse,
)
async def edit_image(
    request: EditRequest,
    settings: Settings = Depends(get_settings),
) -> EditResponse:
    """Edit an existing image with optional mask and prompt."""
    try:
        # Build enhanced prompt with preservation hints
        prompt = request.prompt
        if request.preserve_elements:
            preserve_str = ", ".join(request.preserve_elements)
            prompt = f"{prompt}. Keep the following unchanged: {preserve_str}."

        if request.model == AIModel.GPT_IMAGE:
            if not request.mask_base64:
                raise HTTPException(
                    status_code=400,
                    detail="GPT Image requires a mask for editing. Use semantic edit endpoint for Gemini.",
                )

            service = OpenAIService(settings.openai_api_key)
            result = await service.edit(
                image_base64=request.image_base64,
                mask_base64=request.mask_base64,
                prompt=prompt,
                quality=request.quality.value,
            )
        else:
            service = GeminiService(settings.google_api_key)
            result = await service.edit(
                image_base64=request.image_base64,
                prompt=prompt,
            )

        return EditResponse(
            image_base64=result["image_base64"],
            mime_type=result.get("mime_type", "image/png"),
            token_usage=result.get("token_usage"),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/edit/semantic",
    response_model=EditResponse,
)
async def semantic_edit_image(
    request: SemanticEditRequest,
    settings: Settings = Depends(get_settings),
) -> EditResponse:
    """Edit an image using natural language without a mask (Gemini only)."""
    try:
        # Build enhanced prompt with preservation description
        prompt = request.prompt
        if request.preserve_description:
            prompt = f"{prompt}. {request.preserve_description}"

        service = GeminiService(settings.google_api_key)
        result = await service.edit(
            image_base64=request.image_base64,
            prompt=prompt,
        )

        return EditResponse(
            image_base64=result["image_base64"],
            mime_type=result.get("mime_type", "image/png"),
            token_usage=result.get("token_usage"),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
