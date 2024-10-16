from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...serializers import UserProfileSerializer


@swagger_auto_schema(
    method="patch",
    operation_description="Обновление профиля пользователя. Можно обновить имя, фамилию, номер телефона, Telegram, и URL аватара.",
    tags=["userHandlers"],
    request_body=UserProfileSerializer,
    responses={
        200: openapi.Response(
            description="Профиль обновлен",
            examples={
                "application/json": {
                    "first_name": "Иван",
                    "last_name": "Иванов",
                    "phone_number": "+79991234567",
                    "telegram": "@ivanov",
                    "avatar_url": "http://example.com/avatar.jpg",
                }
            },
        ),
        400: openapi.Response(description="Некорректные данные"),
    },
)
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
