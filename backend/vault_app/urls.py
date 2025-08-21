from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, FolderViewSet, DocumentViewSet, TagViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'folders', FolderViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]