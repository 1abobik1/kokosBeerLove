from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken

from ...models import Player
from ...serializers import PlayerSerializer

# Описание для PUT и PATCH запросов


@swagger_auto_schema(
    method="put",
    operation_description="Полное обновление информации об игроке. Доступно только администраторам (is_superuser == true).",
    tags=["playerHandlers"],
    request_body=PlayerSerializer,
    responses={
        200: openapi.Response(description="Информация об игроке успешно обновлена"),
        400: openapi.Response(description="Неправильные данные"),
        401: openapi.Response(description="Неавторизован. Необходимо передать токен доступа."),
        403: openapi.Response(description="У вас нет прав для изменения информации (нужен is_superuser)."),
        404: openapi.Response(description="Игрок не найден"),
    },
)
@swagger_auto_schema(
    method="patch",
    operation_description="Частичное обновление информации об игроке. Доступно только администраторам (is_superuser == true).",
    tags=["playerHandlers"],
    request_body=PlayerSerializer,
    responses={
        200: openapi.Response(description="Информация об игроке успешно частично обновлена"),
        400: openapi.Response(description="Неправильные данные"),
        401: openapi.Response(description="Неавторизован. Необходимо передать токен доступа."),
        403: openapi.Response(description="У вас нет прав для изменения информации (нужен is_superuser)."),
        404: openapi.Response(description="Игрок не найден"),
    },
)
@api_view(["PUT", "PATCH"])
@permission_classes([IsAdminToken])
def update_player(request, player_id):

    try:
        # Ищем игрока по id
        player = Player.objects.get(id=player_id)
    except Player.DoesNotExist:
        return Response({"error": "Игрок не найден"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()

    # Преобразуем значение role в нижний регистр
    if "role" in data:
        data["role"] = data["role"].lower()

    # Проверяем, какой тип запроса (PUT или PATCH)
    if request.method == "PUT":
        # Полное обновление (все поля обязательны)
        serializer = PlayerSerializer(player, data=data)
    elif request.method == "PATCH":
        # Частичное обновление (некоторые поля могут быть обновлены)
        serializer = PlayerSerializer(player, data=data, partial=True)

    # Проверяем валидность данных
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
