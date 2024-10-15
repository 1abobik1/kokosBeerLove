from django.conf import settings

from ...models import RefreshToken as RefreshTokenModel

REFRESH_COOKIE = "refresh_token"


def set_refresh_cookie(response, token):
    """The refresh token lives only in an httpOnly cookie, so page scripts cannot read it."""
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=settings.REFRESH_COOKIE_SECURE,
        samesite="Lax",
        max_age=int(RefreshTokenModel.LIFETIME.total_seconds()),
    )
