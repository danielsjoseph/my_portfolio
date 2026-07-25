from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ProfileView, ProjectViewSet, TagViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("tags", TagViewSet, basename="tag")

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
] + router.urls
