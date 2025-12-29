from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class AIModel(str, Enum):
    """Supported AI models for image generation."""

    GPT_IMAGE = "gpt-image-1.5"
    GEMINI_FLASH = "gemini-flash"


class Quality(str, Enum):
    """Image generation quality levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class AspectRatio(str, Enum):
    """Supported aspect ratios."""

    SQUARE = "1:1"
    LANDSCAPE = "16:9"
    PORTRAIT = "9:16"
    STANDARD = "4:3"


# Request Models


class GenerateRequest(BaseModel):
    """Request to generate a new interior image from text prompt."""

    prompt: str = Field(..., description="Text description of desired image")
    model: AIModel = Field(default=AIModel.GPT_IMAGE, description="AI model to use")
    quality: Quality = Field(default=Quality.MEDIUM, description="Output quality level")
    aspect_ratio: AspectRatio = Field(
        default=AspectRatio.LANDSCAPE, description="Image aspect ratio"
    )
    stream: bool = Field(default=False, description="Enable streaming response")


class EditRequest(BaseModel):
    """Request to edit an existing image with optional mask."""

    image_base64: str = Field(..., description="Base64-encoded source image")
    mask_base64: Optional[str] = Field(
        None, description="Base64-encoded mask (transparent areas = edit regions)"
    )
    prompt: str = Field(..., description="Description of desired edits")
    model: AIModel = Field(default=AIModel.GPT_IMAGE, description="AI model to use")
    quality: Quality = Field(default=Quality.MEDIUM, description="Output quality level")
    preserve_elements: Optional[list[str]] = Field(
        None,
        description="Elements to preserve (e.g., 'lighting', 'wall color')",
    )


class SemanticEditRequest(BaseModel):
    """Request for semantic editing without mask (Gemini only)."""

    image_base64: str = Field(..., description="Base64-encoded source image")
    prompt: str = Field(
        ...,
        description="Natural language description of edit (e.g., 'change the blue sofa to brown')",
    )
    preserve_description: Optional[str] = Field(
        None,
        description="What to keep unchanged (e.g., 'Keep lighting, walls, and other furniture unchanged')",
    )


# Response Models


class TokenUsage(BaseModel):
    """Token usage information for cost tracking."""

    input_tokens: int
    output_tokens: int
    total_tokens: int


class GenerateResponse(BaseModel):
    """Response from image generation."""

    image_base64: str = Field(..., description="Base64-encoded generated image")
    mime_type: str = Field(default="image/png", description="Image MIME type")
    description: Optional[str] = Field(
        None, description="AI-generated description of the image"
    )
    token_usage: Optional[TokenUsage] = Field(None, description="Token usage stats")


class EditResponse(BaseModel):
    """Response from image editing."""

    image_base64: str = Field(..., description="Base64-encoded edited image")
    mime_type: str = Field(default="image/png", description="Image MIME type")
    token_usage: Optional[TokenUsage] = Field(None, description="Token usage stats")


class ErrorResponse(BaseModel):
    """Error response."""

    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = Field(default="ok")
    version: str = Field(default="0.1.0")
