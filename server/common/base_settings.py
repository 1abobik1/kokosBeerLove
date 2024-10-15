"""Base Django settings shared by every microservice.

A service's settings.py does `from common.base_settings import *` and then sets its own
SECRET_KEY, INSTALLED_APPS, ROOT_URLCONF, WSGI_APPLICATION, DATABASES and CACHES.
All values come from the environment (docker compose passes .env), so nothing secret lives in the code.
"""
from datetime import timedelta
from pathlib import Path

from decouple import Csv, config
from dotenv import load_dotenv

# Local runs (python manage.py ...) read the .env in the repository root; in Docker the variables are already set.
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
load_dotenv(REPO_ROOT / ".env")

DEBUG = config("DJANGO_DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="localhost,127.0.0.1,0.0.0.0", cast=Csv())

BASE_INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "drf_yasg",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    # Must come before CommonMiddleware so that CORS headers are added to every response.
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "common.cache.InvalidateCacheOnWriteMiddleware",
]

_ORIGINS = "http://localhost,https://localhost,http://localhost:8080,http://localhost:3000"
CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS", default=_ORIGINS, cast=Csv())
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", default=_ORIGINS, cast=Csv())
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ["Authorization", "Content-Type", "X-CSRFToken", "X-Requested-With"]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "ru-ru"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

MEDIA_ROOT = "/uploads"
MEDIA_URL = "/uploads/"

# Services other than auth have no user table: the user is taken from the JWT payload
# (user_id, is_superuser), which is signed with the shared JWT_SIGNING_KEY.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTTokenUserAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=60),
    "ROTATE_REFRESH_TOKENS": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": config("JWT_SIGNING_KEY"),
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO"},
}


def static_root(base_dir):
    return Path(base_dir) / "staticfiles"


def database_from_env(prefix):
    """PostgreSQL settings from DATABASE_{NAME,USER,PASSWORD,HOST,PORT}_<prefix>."""
    return {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": config(f"DATABASE_NAME_{prefix}"),
            "USER": config(f"DATABASE_USER_{prefix}"),
            "PASSWORD": config(f"DATABASE_PASSWORD_{prefix}"),
            "HOST": config(f"DATABASE_HOST_{prefix}", default="localhost"),
            "PORT": config(f"DATABASE_PORT_{prefix}", default="5432"),
        }
    }


def redis_cache(db_number):
    """Each service caches in its own Redis database, so clearing it does not affect the others."""
    redis_url = config("REDIS_URL", default="redis://redis:6379")
    return {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": f"{redis_url}/{db_number}",
            "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
        }
    }
