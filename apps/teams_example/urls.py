from django.urls import path

from . import views

app_name = "teams_example"

urlpatterns = [
    path("", views.PlayerListView.as_view(), name="player_list"),
    path("new/", views.PlayerCreateView.as_view(), name="player_create"),
    path("<int:pk>/", views.PlayerDetailView.as_view(), name="player_detail"),
    path("<int:pk>/update/", views.PlayerUpdateView.as_view(), name="player_update"),
    path("<int:pk>/delete/", views.PlayerDeleteView.as_view(), name="player_delete"),
]
