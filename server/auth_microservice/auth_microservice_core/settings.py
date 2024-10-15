"""Settings of auth_microservice: the common base (server/common/base_settings.py) plus users and email."""
from pathlib import Path

from decouple import config

from common.base_settings import *  # noqa: F401,F403
from common.base_settings import BASE_INSTALLED_APPS, REST_FRAMEWORK, database_from_env, static_root

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY_AUTH")

INSTALLED_APPS = BASE_INSTALLED_APPS + ["auth_microservice_app"]
ROOT_URLCONF = "auth_microservice_core.urls"
WSGI_APPLICATION = "auth_microservice_core.wsgi.application"

DATABASES = database_from_env("AUTH")
STATIC_ROOT = static_root(BASE_DIR)

# This service owns the users table, so tokens are checked against real users here.
AUTH_USER_MODEL = "auth_microservice_app.CustomUser"
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
}

# Without EMAIL_HOST_AUTH (e.g. local docker compose) letters are printed to the service log.
EMAIL_HOST = config("EMAIL_HOST_AUTH", default="")
if EMAIL_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_PORT = config("EMAIL_PORT_AUTH", default=587, cast=int)
    EMAIL_USE_TLS = config("EMAIL_USE_TLS_AUTH", default=True, cast=bool)
    EMAIL_HOST_USER = config("EMAIL_HOST_USER_AUTH")
    EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD_AUTH")
    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    DEFAULT_FROM_EMAIL = "noreply@localhost"
