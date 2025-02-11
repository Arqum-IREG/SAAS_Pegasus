from django.apps import AppConfig


class ECommerceConfig(AppConfig):
    name = "apps.ecommerce"
    label = "ecommerce"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        from . import webhooks  # noqa
