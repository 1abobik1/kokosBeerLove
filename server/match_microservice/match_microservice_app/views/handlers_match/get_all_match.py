from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Match
from ...serializers import MatchSerializer


@swagger_auto_schema(
    method='get',
    operation_description="Получение списка всех матчей, отсортированных по дате и времени (от ближайшего к прошедшему).",
    tags=["getHandlers"],
    responses={200: openapi.Response(
        description="Успешный ответ с данными всех матчей",
        examples={
            "application/json": [
                {
                    "team_home": "Команда Х",
                    "team_away_name": "Команда Y",
                    "team_away_logo_url": "http://example.com/logo_y.jpg",
                    "score_home": 2,
                    "score_away": 1,
                    "location": "Стадион 1",
                    "division": "Премьер-лига",
                    "video_url": "http://example.com/match_video",
                    "match_date": "2024-10-09",
                    "match_time": "14:00:00"
                }
            ]
        }
    )}
)
@cache_page(60 * 20)
@api_view(['GET'])
def get_all_matches(request):
    # Получаем все матчи, отсортированные по дате и времени (сначала предстоящие, затем прошедшие)
    matches = Match.objects.all().order_by('-match_date', '-match_time')

    # Сериализуем данные
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data)
