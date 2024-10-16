from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Player
from ...serializers import PlayerSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получение информации об игроке по ID.",
    tags=["playerHandlers"],
    manual_parameters=[
        openapi.Parameter(
            "player_id",
            openapi.IN_PATH,
            description="ID игрока",
            type=openapi.TYPE_INTEGER,
        )
    ],
    responses={
        200: openapi.Response(
            description="Успешный ответ с данными игрока",
            examples={
                "application/json": {
                    "id": 1,
                    "first_name": "Иван",
                    "last_name": "Иванов",
                    "middle_name": "Иванович",
                    "role": "защитник",
                    "games_played": 10,
                    "goals_scored": 3,
                    "assists_made": 2,
                    "yellow_cards": 1,
                    "red_cards": 0,
                    "photo_url": "http://example.com/photos/ivanov.jpg",
                }
            },
        ),
        404: openapi.Response(description="Игрок не найден"),
    },
)
@api_view(["GET"])
def get_player_by_id(request, player_id):
    try:
        player = Player.objects.get(id=player_id)
    except Player.DoesNotExist:
        return Response({"error": "Игрок не найден"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PlayerSerializer(player)
    return Response(serializer.data, status=status.HTTP_200_OK)
