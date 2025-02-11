from functools import cached_property

from django.conf import settings
from django.db import models
from django.templatetags.static import static
from django.utils.translation import gettext_lazy as _
from djstripe.models import Price, Product

from apps.utils.billing import get_price_display_with_currency
from apps.utils.models import BaseModel


class ProductConfiguration(BaseModel):
    """
    Product Configuration for models that appear in your store.
    """

    slug = models.SlugField(max_length=128, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    overview = models.TextField(
        blank=True, default="", help_text=_("Overview of the product, displayed on the store page.")
    )

    def __str__(self):
        return self.product.name

    @property
    def image_url(self):
        if self.product.images:
            return self.product.images[0]
        else:
            return static("images/undraw/undraw_happy_birthday.svg")

    @cached_property
    def price(self):
        return self.product.default_price

    @cached_property
    def readable_price(self):
        return get_price_display_with_currency(self.price.unit_amount_decimal / 100, self.price.currency)


class Purchase(BaseModel):
    """
    Purchases made by users
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product_configuration = models.ForeignKey(ProductConfiguration, on_delete=models.CASCADE)
    # note: product is deprecated in favor of product_configuration and may be removed in an upcoming release
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.ForeignKey(Price, on_delete=models.CASCADE)
    checkout_session_id = models.CharField(max_length=100, unique=True, db_index=True)
    is_valid = models.BooleanField(default=True)

    def __str__(self):
        return f"Purchase of {self.product_configuration} by {self.user}"
