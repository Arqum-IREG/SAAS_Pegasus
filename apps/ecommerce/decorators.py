from functools import wraps

from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from apps.ecommerce.helpers import get_valid_user_purchase
from apps.ecommerce.models import ProductConfiguration


def product_required(view_func):
    @wraps(view_func)
    def _inner(request, *args, **kwargs):
        user = request.user
        product_slug = kwargs.get("product_slug")
        product_config = get_object_or_404(ProductConfiguration.objects.select_related("product"), slug=product_slug)
        if purchase := get_valid_user_purchase(user, product_config):
            request.product_purchase = purchase
            request.product_config = product_config
            return view_func(request, *args, **kwargs)
        else:
            messages.error(request, _("Sorry, you must own this product to view that page."))
            # redirect to the ecommerce home page. you could alternatively raise Http404 to return a generic 404 page.
            return HttpResponseRedirect(reverse("ecommerce:ecommerce_home"))

    return _inner
