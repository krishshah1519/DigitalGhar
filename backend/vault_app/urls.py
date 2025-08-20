from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FolderViewSet , DocumentViewSet, TagViewSet

router = DefaultRouter()
router.register(r'folders', FolderViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = [
    path('', include(router.urls)),
]