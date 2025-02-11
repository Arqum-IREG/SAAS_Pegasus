import requests
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.template.response import TemplateResponse
from openai import OpenAI
from requests import HTTPError

from .forms import ImagePromptForm


class ImageGenException(Exception):
    def __init__(self, message, api_key_setting):
        self.message = message
        self.api_key_setting = api_key_setting

    def __str__(self):
        return f"{self.message}. Please check your settings: {self.api_key_setting}"


@login_required
def images_home(request):
    image_urls = []
    if request.method == "POST":
        form = ImagePromptForm(request.POST)
        if form.is_valid():
            service = form.cleaned_data["service"]
            prompt = form.cleaned_data["prompt"]
            service_fn = {
                "dall-e-2": _dalle_2,
                "dall-e-3": _dalle_3,
                "stability": _stability_ai,
            }[service]

            try:
                image_urls = service_fn(prompt)
            except ImageGenException as e:
                messages.error(request, str(e))
    else:
        form = ImagePromptForm()
    return TemplateResponse(
        request,
        "ai_images/image_home.html",
        {
            "active_tab": "ai-images",
            "form": form,
            "image_urls": image_urls,
        },
    )


def _dalle_2(prompt):
    return _openai(prompt, model="dall-e-2", n=4, size="512x512")


def _dalle_3(prompt):
    # dall-e-3 only allows one image at a time.
    return _openai(prompt, model="dall-e-3", n=1, size="1024x1024")


def _openai(prompt, **openai_kwargs):
    if not settings.AI_IMAGES_OPENAI_API_KEY:
        raise ImageGenException("API Key not set", "AI_IMAGES_OPENAI_API_KEY")
    client = OpenAI(api_key=settings.AI_IMAGES_OPENAI_API_KEY)

    try:
        openai_response = client.images.generate(prompt=prompt, quality="standard", **openai_kwargs)
    except Exception as e:
        raise ImageGenException(str(e), "AI_IMAGES_OPENAI_API_KEY")
    return [data.url for data in openai_response.data]


def _stability_ai(prompt):
    if not settings.AI_IMAGES_STABILITY_AI_API_KEY:
        raise ImageGenException("API Key not set", "AI_IMAGES_STABILITY_AI_API_KEY")
    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        headers={"authorization": f"Bearer {settings.AI_IMAGES_STABILITY_AI_API_KEY}", "accept": "image/*"},
        files={"none": ""},
        data={
            "prompt": prompt,
            "output_format": "jpeg",
        },
    )

    try:
        response.raise_for_status()
    except HTTPError as e:
        raise ImageGenException(str(e), "AI_IMAGES_STABILITY_AI_API_KEY")
    name = default_storage.save("stability_ai_image_demo.webp", ContentFile(response.content))
    return [default_storage.url(name)]
