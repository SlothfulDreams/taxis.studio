import base64
from io import BytesIO
from typing import Any

from openai import AsyncOpenAI

from app.services.constants import INTERIOR_DESIGN_PROMPT_TEMPLATE


class OpenAIService:
    """Service for interacting with OpenAI GPT Image 1.5 API."""

    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = "gpt-image-1.5"

    def _get_size_from_aspect_ratio(self, aspect_ratio: str) -> str:
        """Convert aspect ratio to OpenAI size parameter."""
        sizes = {
            "1:1": "1024x1024",
            "16:9": "1536x1024",
            "9:16": "1024x1536",
            "4:3": "1536x1024",  # Approximate with landscape
        }
        return sizes.get(aspect_ratio, "1024x1024")

    async def generate(
        self,
        prompt: str,
        quality: str = "medium",
        aspect_ratio: str = "16:9",
    ) -> dict[str, Any]:
        """Generate a new image from a text prompt."""
        # Enhance prompt for interior design
        enhanced_prompt = INTERIOR_DESIGN_PROMPT_TEMPLATE.format(prompt=prompt)

        size = self._get_size_from_aspect_ratio(aspect_ratio)

        response = await self.client.images.generate(
            model=self.model,
            prompt=enhanced_prompt,
            n=1,
            size=size,
            quality=quality,
            output_format="png",
        )

        # GPT Image returns base64 directly
        image_data = response.data[0]

        result = {
            "image_base64": image_data.b64_json,
            "mime_type": "image/png",
        }

        # Add token usage if available
        if hasattr(response, "usage") and response.usage:
            result["token_usage"] = {
                "input_tokens": response.usage.prompt_tokens,
                "output_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            }

        return result

    async def edit(
        self,
        image_base64: str,
        mask_base64: str,
        prompt: str,
        quality: str = "medium",
    ) -> dict[str, Any]:
        """Edit an existing image using a mask."""
        # Decode base64 images to bytes
        image_bytes = base64.b64decode(image_base64)
        mask_bytes = base64.b64decode(mask_base64)

        # Enhance prompt for interior design editing
        enhanced_prompt = f"Interior design edit: {prompt}. Maintain photorealistic quality, consistent lighting, and natural integration with existing elements."

        # Convert to file-like objects for the API
        image_file = BytesIO(image_bytes)
        image_file.name = "image.png"

        mask_file = BytesIO(mask_bytes)
        mask_file.name = "mask.png"

        response = await self.client.images.edit(
            model=self.model,
            image=image_file,
            mask=mask_file,
            prompt=enhanced_prompt,
            n=1,
            quality=quality,
        )

        image_data = response.data[0]

        result = {
            "image_base64": image_data.b64_json,
            "mime_type": "image/png",
        }

        if hasattr(response, "usage") and response.usage:
            result["token_usage"] = {
                "input_tokens": response.usage.prompt_tokens,
                "output_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            }

        return result
