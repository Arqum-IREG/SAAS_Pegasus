from django import forms


class ImagePromptForm(forms.Form):
    service = forms.ChoiceField(
        label="AI Service",
        choices=(("dall-e-2", "OpenAI DALL-E 2"), ("dall-e-3", "OpenAI DALL-E 3"), ("stability", "Stable Diffusion 3")),
    )
    prompt = forms.CharField(
        widget=forms.Textarea(attrs={"rows": "3"}), help_text="E.g. 'A pegasus in space in the style of tron'"
    )
