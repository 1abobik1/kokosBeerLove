from django.contrib.auth import authenticate
from django.utils import timezone
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...custom_tokens import CustomRefreshToken
from ...models import RefreshToken as RefreshTokenModel
from ...serializers import LoginSerializer
from .session import set_refresh_cookie


@swagger_auto_schema(
    method="post",
    operation_description="Логин пользователя. Refresh-токен ставится в httpOnly cookie.",
    tags=["authHandlers"],
    request_body=LoginSerializer,
    responses={
        200: openapi.Response("Успешная аутентификация, в ответе access-токен"),
        401: openapi.Response("Неверный email или пароль"),
    },
)
@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    user = None
    if serializer.is_valid():
        user = authenticate(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
    if user is None:
        # One answer for a wrong email and a wrong password: it must not reveal which accounts exist.
        return Response({"error": "Неверный email или пароль"}, status=status.HTTP_401_UNAUTHORIZED)

    # One active session per user: a new login ends the previous one.
    RefreshTokenModel.objects.filter(user=user).delete()
    refresh = CustomRefreshToken.for_user(user)
    RefreshTokenModel.objects.create(
        user=user,
        token=str(refresh),
        expires_at=timezone.now() + RefreshTokenModel.LIFETIME,
    )

    response = Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)
    set_refresh_cookie(response, str(refresh))
    return response
