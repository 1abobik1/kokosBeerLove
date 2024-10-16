"""Helpers for the services' tests."""

from django.test import override_settings
from rest_framework_simplejwt.tokens import AccessToken

# Tests must not read or clear the Redis cache of a running stack.
use_local_cache = override_settings(
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
)


def auth_header(user_id, is_superuser=False):
    """An Authorization header with a token like the one issued by auth_microservice."""
    token = AccessToken()
    token["user_id"] = user_id
    token["is_superuser"] = is_superuser
    return {"HTTP_AUTHORIZATION": f"Bearer {token}"}


ADMIN = auth_header(1, is_superuser=True)
FAN = auth_header(2)
