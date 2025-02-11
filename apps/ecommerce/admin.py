from django.contrib import admin

from .models import ProductConfiguration, Purchase


@admin.register(ProductConfiguration)
class ProductConfigurationAdmin(admin.ModelAdmin):
    list_display = ["slug", "product", "created_at", "is_active"]


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ["product", "product_configuration__product", "user", "created_at", "is_valid"]
    list_filter = ["product", "user", "created_at", "is_valid"]
