from django.conf import settings


class UnknownModelError(Exception):
    pass


def get_llm_kwargs(model_name=None):
    model_name = model_name or settings.DEFAULT_LLM_MODEL
    try:
        return {"model": model_name, **settings.LLM_MODELS[model_name]}
    except KeyError:
        raise UnknownModelError(model_name)
