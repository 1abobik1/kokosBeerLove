from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import RefreshToken as RefreshTokenModel
from .session import REFRESH_COOKIE


@swagger_auto_schema(
    method="post",
    operation_description="Выход: refresh-токен из cookie удаляется из базы, после этого refresh/ его не примет.",
    tags=["authHandlers"],
    responses={204: openapi.Response("Успешный выход")},
)
@api_view(["POST"])
def logout(request):
    refresh_token = request.COOKIES.get(REFRESH_COOKIE)
    if refresh_token:
        RefreshTokenModel.objects.filter(token=refresh_token).delete()

    response = Response(status=status.HTTP_204_NO_CONTENT)
    response.delete_cookie(REFRESH_COOKIE)
    return response
