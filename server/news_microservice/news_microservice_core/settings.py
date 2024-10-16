"""Settings of news_microservice: the common base (server/common/base_settings.py) plus what is specific to it."""

from pathlib import Path

from decouple import config

from common.base_settings import *  # noqa: F401,F403
from common.base_settings import BASE_INSTALLED_APPS, database_from_env, redis_cache, static_root

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY_NEWS")

INSTALLED_APPS = BASE_INSTALLED_APPS + ["news_microservice_app"]
ROOT_URLCONF = "news_microservice_core.urls"
WSGI_APPLICATION = "news_microservice_core.wsgi.application"

DATABASES = database_from_env("NEWS")
CACHES = redis_cache(1)
STATIC_ROOT = static_root(BASE_DIR)
