from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Player
from ...serializers import PlayerSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получение списка всех игроков. Данные кэшируются на 15 минут.",
    tags=["playerHandlers"],
    responses={
        200: openapi.Response(
            description="Успешный ответ с данными игроков",
            examples={
                "application/json": [
                    {
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
                ]
            },
        )
    },
)
@cache_page(60 * 20)
@api_view(["GET"])
def get_all_players(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)
