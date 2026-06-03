from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/token', views.LoginView.as_view()),
    path('auth/me', views.MeView.as_view()),

    # Users (public)
    path('users/', views.UserListView.as_view()),

    # Entries — pending/me MUST come before <int:pk>
    path('entries/', views.EntryListView.as_view()),
    path('entries/pending/me', views.PendingEntriesView.as_view()),
    path('entries/<int:pk>', views.EntryDetailView.as_view()),

    # Images — specific patterns first
    path('images/upload/<int:entry_id>', views.ImageUploadView.as_view()),
    path('images/<int:image_id>/featured', views.ImageSetFeaturedView.as_view()),
    path('images/<int:image_id>', views.ImageDeleteView.as_view()),
    path('images/<str:filename>', views.ImageServeView.as_view()),
]
