<<<<<<< HEAD
=======
from django.views.decorators.cache import cache_page
from drf_yasg.utils import swagger_auto_schema
>>>>>>> b12af1f995f6b144372af8a8e816486f4c1911a7
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import NewsArticle
from ...serializers import NewsArticleSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получить новостную статью по идентификатору",
    tags=['NewsArticle'],
    manual_parameters=[
        openapi.Parameter(
            "article_id",
            openapi.IN_PATH,
            description="ID статьи",
            type=openapi.TYPE_INTEGER,
        )
    ],
    responses={200: NewsArticleSerializer(), 404: "Статья не найдена"},
)
<<<<<<< HEAD
# Новый эндпоинт для получения статьи по ID
@api_view(["GET"])
=======

@cache_page(60 * 20)
@api_view(['GET'])
>>>>>>> b12af1f995f6b144372af8a8e816486f4c1911a7
def get_news_article_by_id(request, article_id):
    try:
        article = NewsArticle.objects.get(id=article_id)
    except NewsArticle.DoesNotExist:
        return Response(
            {"error": "Статья не найдена"}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = NewsArticleSerializer(article)
    return Response(serializer.data)
