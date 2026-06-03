from rest_framework import serializers
from .models import BlogEntry, EntryImage, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'role', 'is_active']


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'role']


class EntryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntryImage
        fields = ['id', 'filename', 'caption', 'is_featured', 'order_index']


class BlogEntrySerializer(serializers.ModelSerializer):
    images = EntryImageSerializer(many=True, read_only=True)

    class Meta:
        model = BlogEntry
        fields = [
            'id', 'title', 'description', 'date',
            'paragraph_hombre', 'paragraph_mujer',
            'categories', 'created_at', 'updated_at', 'images',
        ]
