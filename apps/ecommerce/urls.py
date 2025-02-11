from django.urls import path

from . import views

app_name = "ecommerce"

urlpatterns = [
    path("", views.ecommerce_home, name="ecommerce_home"),
    path("products/<slug:product_slug>/purchase/", views.purchase_product, name="purchase_product"),
    path("products/<slug:product_slug>/purchase/success/", views.checkout_success, name="checkout_success"),
    path("products/<slug:product_slug>/purchase/cancel/", views.checkout_cancelled, name="checkout_cancelled"),
    path("purchases/", views.purchases, name="purchases"),
    path("get/<slug:product_slug>/", views.access_product, name="access_product"),
]
