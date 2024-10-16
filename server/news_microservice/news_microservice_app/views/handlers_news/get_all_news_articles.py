from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import NewsArticle
from ...serializers import NewsArticleSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получение всех новостей",
    tags=["NewsArticle"],
    responses={
        200: openapi.Response(
            description="Список всех новостей",
            examples={
                "application/json": [
                    {
                        "id": 1,
                        "title": "Заголовок новости",
                        "text": "Текст новости",
                        "image_url": "news_images/image",
                        "created_at": "2024-10-06T12:00:00Z",
                    }
                ]
            },
        )
    },
)
@cache_page(60 * 20)
@api_view(["GET"])
def get_all_news_articles(request):
    articles = NewsArticle.objects.all()
    serializer = NewsArticleSerializer(articles, many=True)
    return Response(serializer.data)
