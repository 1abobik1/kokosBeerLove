from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ...models import Match
from ...serializers import MatchSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    method='get',
    operation_description="Получение информации о конкретном матче по его ID. Данные о team_away включают название и логотип команды.",
    manual_parameters=[
        openapi.Parameter('id', openapi.IN_PATH, description="ID матча", type=openapi.TYPE_INTEGER)
    ],
    responses={
        200: openapi.Response(
            description="Успешный ответ с данными о матче",
            examples={
                "application/json": {
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
            }
        ),
        404: openapi.Response(description="Матч не найден"),
    }
)
@cache_page(60 * 20)
@api_view(['GET'])
def get_match_by_id(request, id):
    try:
        match = Match.objects.get(id=id)
        serializer = MatchSerializer(match)
        return Response(serializer.data)
    except Match.DoesNotExist:
        return Response({'error': 'Матч не найден'}, status=404)
