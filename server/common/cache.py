from django.core.cache import cache


def invalidate_cache():
    """Drops this service's cached GET responses after data changed.

    Views are cached with @cache_page for 20 minutes; without this an admin's changes
    were invisible on the site until the cache expired. Every service uses its own
    Redis database, so this does not touch the other services' caches.
    """
    cache.clear()


class InvalidateCacheOnWriteMiddleware:
    """Clears the service cache after every successful POST/PUT/PATCH/DELETE.

    One place instead of a call in every create/update/delete handler: the cached lists and
    details are rebuilt on the next GET, so an admin's changes appear on the site immediately.
    """

    SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.method not in self.SAFE_METHODS and response.status_code < 400:
            invalidate_cache()
        return response
