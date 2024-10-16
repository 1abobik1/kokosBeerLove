"""Settings of match_microservice: the common base (server/common/base_settings.py) plus what is specific to it."""

from pathlib import Path

from decouple import config

from common.base_settings import *  # noqa: F401,F403
from common.base_settings import BASE_INSTALLED_APPS, database_from_env, redis_cache, static_root

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY_MATCH")

INSTALLED_APPS = BASE_INSTALLED_APPS + ["match_microservice_app"]
ROOT_URLCONF = "match_microservice_core.urls"
WSGI_APPLICATION = "match_microservice_core.wsgi.application"

DATABASES = database_from_env("MATCH")
CACHES = redis_cache(2)
STATIC_ROOT = static_root(BASE_DIR)
