from django.core.cache import cache


def invalidate_cache():
    """Drops this service's cached GET responses after data changed.

    Views are cached with @cache_page for 20 minutes; without this an admin's changes
    were invisible on the site until the cache expired. Every service uses its own
    Redis database, so this does not touch the other services' caches.
    """
    cache.clear()
