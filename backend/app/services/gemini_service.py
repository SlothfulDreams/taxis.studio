from typing import Any

from google import genai
from google.genai import types

from app.constants import ASPECT_RATIO_MAPPINGS, DEFAULT_MIME_TYPE, MODEL_GEMINI_FLASH
from app.services.constants import INTERIOR_DESIGN_PROMPT_TEMPLATE


class GeminiService:
    """Service for interacting with Google Gemini 2.5 Flash Image API."""

    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.model = MODEL_GEMINI_FLASH

    def _get_gemini_aspect_ratio(self, aspect_ratio: str) -> str:
        """Convert aspect ratio to Gemini format."""
        # Gemini supports: 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
        ratios = {
            "1:1": "1:1",
            "16:9": "16:9",
            "9:16": "9:16",
            "4:3": "4:3",
            "3:4": "3:4",
        }
        return ratios.get(aspect_ratio, "16:9")

    async def generate(
        self,
        prompt: str,
        aspect_ratio: str = "16:9",
    ) -> dict[str, Any]:
        """Generate a new image from a text prompt."""
        # Enhance prompt for interior design
        enhanced_prompt = INTERIOR_DESIGN_PROMPT_TEMPLATE.format(prompt=prompt)

        gemini_ratio = self._get_gemini_aspect_ratio(aspect_ratio)

        response = self.client.models.generate_content(
            model=self.model,
            contents=[enhanced_prompt],
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(aspect_ratio=gemini_ratio),
            ),
        )

        # Extract image and text from response
        image_base64 = None
        description = None

        for part in response.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                image_base64 = part.inline_data.data
            elif hasattr(part, "text") and part.text:
                description = part.text

        if not image_base64:
            raise ValueError("No image generated in response")

        result = {
            "image_base64": image_base64,
            "mime_type": DEFAULT_MIME_TYPE,
            "description": description,
        }

        return result

    async def edit(
        self,
        image_base64: str,
        prompt: str,
    ) -> dict[str, Any]:
        """Edit an existing image using semantic understanding (no mask required)."""
        # Enhance prompt for interior design editing
        enhanced_prompt = f"Using the provided interior image, make the following change: {prompt}. Maintain photorealistic quality, consistent lighting, and preserve all elements not explicitly mentioned in the edit request."

        # Prepare the image for Gemini
        image_part = {
            "inline_data": {
                "mime_type": DEFAULT_MIME_TYPE,
                "data": image_base64,
            }
        }

        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                image_part,
                {"text": enhanced_prompt},
            ],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(aspect_ratio="16:9"),
            ),
        )

        # Extract image from response
        image_base64_result = None

        for part in response.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                image_base64_result = part.inline_data.data
                break

        if not image_base64_result:
            raise ValueError("No image generated in response")

        result = {
            "image_base64": image_base64_result,
            "mime_type": DEFAULT_MIME_TYPE,
        }

        return result
