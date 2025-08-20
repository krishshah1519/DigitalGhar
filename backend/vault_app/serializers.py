from rest_framework import serializers
from .models import Folder, Document, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'name', 'file', 'file_type', 'folder', 'tags', 'created_at']

class FolderSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    class Meta:
        model = Folder
        fields = ['id', 'name', 'documents', 'created_at']