from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from .models import User, Folder, Document, Tag
from .serializers import RegisterSerializer, FolderSerializer, DocumentSerializer, TagSerializer, UserSerializer, \
    ChangePasswordSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "password set"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['folder', 'tags']
    search_fields = ['name', 'file']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TagViewSet(viewsets.ModelViewSet):

    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
