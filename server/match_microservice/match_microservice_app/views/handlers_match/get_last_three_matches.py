from datetime import datetime

from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Match
from ...serializers import MatchSerializer


@swagger_auto_schema(
    method='get',
    operation_description="Получение последних 2 матчей. Данные о team_away включают название и логотип команды.",
    tags=["getHandlers"],
    responses={200: openapi.Response(
        description="Успешный ответ с данными последних 2 матчей",
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
                    "match_date": "2024-11-10",
                    "match_time": "14:00:00"
                }
            ]
        }
    )}
)
@api_view(['GET'])
def get_last_three_matches(request):
    now = datetime.now()

    # Фильтруем завершённые матчи (включаем матчи сегодняшнего дня, время которых уже прошло)
    last_matches = Match.objects.filter(
        match_date__lt=now.date()
    ).union(
        Match.objects.filter(match_date=now.date(), match_time__lte=now.time())
    ).order_by('-match_date', '-match_time')[:3]

    # Сериализуем данные
    serializer = MatchSerializer(last_matches, many=True)
    return Response(serializer.data)