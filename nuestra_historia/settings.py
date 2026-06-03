import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-this-key')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
ALLOWED_HOSTS = [h.strip() for h in os.getenv('ALLOWED_HOSTS', '*').split(',')]

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

APPEND_SLASH = False

ROOT_URLCONF = 'nuestra_historia.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': False,
    'OPTIONS': {'context_processors': []},
}]

WSGI_APPLICATION = 'nuestra_historia.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_USER_MODEL = 'api.User'
AUTH_PASSWORD_VALIDATORS = []

USE_TZ = False
TIME_ZONE = 'Europe/Madrid'
LANGUAGE_CODE = 'es-es'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Static files — served from frontend/dist/assets/
_assets_dir = BASE_DIR / 'frontend' / 'dist' / 'assets'
STATIC_URL = '/assets/'
STATICFILES_DIRS = [_assets_dir] if _assets_dir.exists() else []
STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise serves all files in frontend/dist/ at their exact URL path
_dist_dir = BASE_DIR / 'frontend' / 'dist'
if _dist_dir.exists():
    WHITENOISE_ROOT = str(_dist_dir)

# Uploaded images served at /api/images/<filename>
MEDIA_URL = '/api/images/'
MEDIA_ROOT = BASE_DIR / 'uploads'

CORS_ALLOW_ALL_ORIGINS = True
