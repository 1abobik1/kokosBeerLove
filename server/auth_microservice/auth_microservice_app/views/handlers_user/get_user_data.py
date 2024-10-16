from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import CustomUser
from ...serializers import UserAllDataSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получение данных пользователя по access токену. Важно передать валидный токен.",
    tags=["userHandlers"],
    responses={
        200: openapi.Response(
            description="Успешное получение данных пользователя",
            examples={
                "application/json": {
                    "email": "exmaple@mail.ru",
                    "username": "example",
                    "first_name": "Иван",
                    "last_name": "Иванов",
                    "phone_number": "+79991234567",
                    "telegram": "@ivanov",
                    "avatar_url": "http://example.com/avatar.jpg",
                }
            },
        ),
        404: openapi.Response(description="Пользователь не найден"),
        401: openapi.Response(description="Неавторизован"),
    },
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    try:
        user = request.user
        serializer = UserAllDataSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)
