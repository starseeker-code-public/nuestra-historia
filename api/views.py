import os
import uuid
from django.conf import settings
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils.dateparse import parse_datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.tokens import RefreshToken

from .models import BlogEntry, EntryImage, User
from .serializers import BlogEntrySerializer, EntryImageSerializer, UserSerializer, UserPublicSerializer


# ─── Auth ────────────────────────────────────────────────────────────────────

class LoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = User.objects.get(username=username, is_active=True)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Usuario o contraseña incorrectos'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {'detail': 'Usuario o contraseña incorrectos'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'token_type': 'bearer',
            'user': UserSerializer(user).data,
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ─── Users ────────────────────────────────────────────────────────────────────

class UserListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.filter(is_active=True)
        return Response(UserPublicSerializer(users, many=True).data)


# ─── Entries ─────────────────────────────────────────────────────────────────

class EntryListView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request):
        entries = BlogEntry.objects.prefetch_related('images').all()
        return Response(BlogEntrySerializer(entries, many=True).data)

    def post(self, request):
        data = request.data
        my_para = data.get('my_paragraph') or None
        role = request.user.role

        entry = BlogEntry.objects.create(
            title=data['title'],
            description=data['description'],
            date=parse_datetime(data['date']),
            categories=data.get('categories') or None,
            paragraph_hombre=my_para if role == 'hombre' else None,
            paragraph_mujer=my_para if role == 'mujer' else None,
        )
        return Response(
            BlogEntrySerializer(entry).data,
            status=status.HTTP_201_CREATED,
        )


class PendingEntriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'hombre':
            qs = BlogEntry.objects.filter(
                Q(paragraph_hombre__isnull=True) | Q(paragraph_hombre='')
            )
        else:
            qs = BlogEntry.objects.filter(
                Q(paragraph_mujer__isnull=True) | Q(paragraph_mujer='')
            )
        return Response(BlogEntrySerializer(qs.prefetch_related('images'), many=True).data)


class EntryDetailView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request, pk):
        entry = get_object_or_404(BlogEntry.objects.prefetch_related('images'), pk=pk)
        return Response(BlogEntrySerializer(entry).data)

    def put(self, request, pk):
        entry = get_object_or_404(BlogEntry, pk=pk)
        data = request.data

        if 'title' in data:
            entry.title = data['title']
        if 'description' in data:
            entry.description = data['description']
        if 'date' in data:
            entry.date = parse_datetime(data['date'])
        if 'categories' in data:
            entry.categories = data.get('categories') or None
        if 'my_paragraph' in data:
            para = data.get('my_paragraph') or None
            if request.user.role == 'hombre':
                entry.paragraph_hombre = para
            else:
                entry.paragraph_mujer = para

        entry.save()
        entry.refresh_from_db()
        return Response(BlogEntrySerializer(entry).data)

    def delete(self, request, pk):
        entry = get_object_or_404(BlogEntry, pk=pk)
        for img in entry.images.all():
            filepath = os.path.join(settings.MEDIA_ROOT, img.filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        entry.delete()
        return Response({'message': 'Entrada eliminada'})


# ─── Images ──────────────────────────────────────────────────────────────────

class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, entry_id):
        entry = get_object_or_404(BlogEntry, pk=entry_id)
        file = request.FILES.get('file')
        if not file:
            return Response({'detail': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        caption = request.data.get('caption') or None
        is_featured = request.data.get('is_featured', 'false').lower() == 'true'
        order_index = int(request.data.get('order_index', 0))

        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        ext = os.path.splitext(file.name)[1].lower() or '.jpg'
        filename = f'{uuid.uuid4()}{ext}'
        filepath = os.path.join(settings.MEDIA_ROOT, filename)

        with open(filepath, 'wb') as f:
            for chunk in file.chunks():
                f.write(chunk)

        if is_featured:
            EntryImage.objects.filter(entry=entry, is_featured=True).update(is_featured=False)

        image = EntryImage.objects.create(
            entry=entry,
            filename=filename,
            caption=caption,
            is_featured=is_featured,
            order_index=order_index,
        )
        return Response(EntryImageSerializer(image).data, status=status.HTTP_201_CREATED)


class ImageServeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, filename):
        if '..' in filename:
            raise Http404
        filepath = os.path.join(settings.MEDIA_ROOT, filename)
        if not os.path.exists(filepath):
            raise Http404
        return FileResponse(open(filepath, 'rb'))


class ImageDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, image_id):
        image = get_object_or_404(EntryImage, pk=image_id)
        filepath = os.path.join(settings.MEDIA_ROOT, image.filename)
        if os.path.exists(filepath):
            os.remove(filepath)
        image.delete()
        return Response({'message': 'Imagen eliminada'})


class ImageSetFeaturedView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, image_id):
        entry_id = request.query_params.get('entry_id')
        if not entry_id:
            return Response({'detail': 'entry_id required'}, status=status.HTTP_400_BAD_REQUEST)

        EntryImage.objects.filter(entry_id=entry_id, is_featured=True).update(is_featured=False)
        image = get_object_or_404(EntryImage, pk=image_id)
        image.is_featured = True
        image.save()
        return Response({'message': 'Imagen destacada actualizada'})
