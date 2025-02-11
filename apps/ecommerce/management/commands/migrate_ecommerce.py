from django.conf import settings
from django.core.management import BaseCommand
from django.utils.text import slugify
from djstripe.models import Product

from apps.ecommerce.models import ProductConfiguration, Purchase


class Command(BaseCommand):
    help = "Migrates your Stripe ecommerce setup from the previous version"

    def handle(self, **options):
        if settings.ACTIVE_ECOMMERCE_PRODUCT_IDS:
            print("Creating product configurations from previous ecommerce setup")
            products_to_purchases = {}
            for product_id in settings.ACTIVE_ECOMMERCE_PRODUCT_IDS:
                product = Product.objects.get(id=product_id)
                products_to_purchases[product_id] = _get_or_create_product_config_for_product(product, is_active=True)

            for purchase in Purchase.objects.all():
                if purchase.product_id in products_to_purchases:
                    purchase.product_configuration = products_to_purchases[purchase.product_id]
                else:
                    purchase.product_configuration = _get_or_create_product_config_for_product(
                        purchase.product, is_active=False
                    )
                    products_to_purchases[purchase.product_id] = purchase.product_configuration

                purchase.save()


def _get_or_create_product_config_for_product(product: Product, is_active: bool) -> ProductConfiguration:
    return ProductConfiguration.objects.get_or_create(
        product=product,
        defaults={
            "slug": slugify(product.name),
            "is_active": is_active,
            "overview": product.description,
        },
    )[0]
