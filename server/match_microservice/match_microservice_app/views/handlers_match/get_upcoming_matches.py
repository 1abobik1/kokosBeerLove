from datetime import date, datetime

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Match
from ...serializers import MatchSerializer


@swagger_auto_schema(
    method='get',
    operation_description="Получение списка предстоящих матчей. Данные включают название команд, логотипы и другую информацию о матче.",
    tags=["getHandlers"],
    responses={200: openapi.Response(
        description="Успешный ответ с данными предстоящих матчей",
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
def get_upcoming_matches(request):
    # Получаем текущее время
    now = datetime.now()

    # Фильтруем матчи по дате и времени (где дата и время еще не прошли)
    upcoming_matches = Match.objects.filter(
        match_date__gte=now.date()
    ).exclude(
        match_date=now.date(), match_time__lte=now.time()
    ).order_by('match_date', 'match_time')

    # Сериализуем данные
    serializer = MatchSerializer(upcoming_matches, many=True)
    return Response(serializer.data)