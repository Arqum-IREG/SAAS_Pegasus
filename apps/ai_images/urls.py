from django.urls import path

from . import views

app_name = "ai_images"

urlpatterns = [
    path("", views.images_home, name="images_home"),
]
