from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from djstripe.models import Product
from stripe.error import AuthenticationError

from apps.ecommerce.models import ProductConfiguration
from apps.utils.billing import create_stripe_api_keys_if_necessary


class Command(BaseCommand):
    help = "Bootstraps your Stripe ecommerce setup"

    def handle(self, **options):
        try:
            if create_stripe_api_keys_if_necessary():
                print("Added Stripe secret key to the database...")
            print("Syncing products and plans from Stripe")
            call_command("djstripe_sync_models", "price")
            # create product configurations for all active products with default prices that aren't recurring (subscriptions)
            for product in Product.objects.filter(active=True, default_price__recurring__isnull=True).exclude(
                default_price__isnull=True
            ):
                print("Creating product configuration for", product.name)
                ProductConfiguration.objects.get_or_create(
                    product=product,
                    defaults={
                        "slug": slugify(product.name),
                        "is_active": product.active,
                        "overview": product.description,
                    },
                )
        except AuthenticationError:
            print(
                "\n======== ERROR ==========\n"
                "Failed to authenticate with Stripe! Check your Stripe key settings.\n"
                "More info: https://docs.saaspegasus.com/subscriptions.html#getting-started"
            )
