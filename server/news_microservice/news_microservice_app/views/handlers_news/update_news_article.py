from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken
from ...models import NewsArticle
from ...serializers import NewsArticleSerializer


@swagger_auto_schema(
    method="put",
    operation_description="Полное обновление существующей новости. ВАЖНО ПЕРЕДАТЬ access token, если в payload будет is_superuser == true(то пользователь-администратор), иначе ответит 401 или 403",
    tags=['NewsArticle'],
    request_body=NewsArticleSerializer,
    responses={
        200: openapi.Response(
            description="Новость успешно обновлена"),
        400: openapi.Response(
            description="Неправильные данные"),
        401: openapi.Response(
            description="Неавторизован"),
        403: openapi.Response(
            description="Нет прав для обновления новости"),
        404: openapi.Response(
            description="Новость не найдена"),
    },
)
@swagger_auto_schema(
    method="patch",
    operation_description="Частичное обновление существующей новости. ВАЖНО ПЕРЕДАТЬ access token, если в payload будет is_superuser == true(то пользователь-администратор), иначе ответит 401 или 403",
    tags=['NewsArticle'],
    request_body=NewsArticleSerializer,
    responses={
        200: openapi.Response(
            description="Новость успешно частично обновлена"),
        400: openapi.Response(
            description="Неправильные данные"),
        401: openapi.Response(
            description="Неавторизован"),
        403: openapi.Response(
            description="Нет прав для обновления новости"),
        404: openapi.Response(
            description="Новость не найдена"),
    },
)
@api_view(["PUT", "PATCH"])
@permission_classes([IsAdminToken])
def update_news_article(request, article_id):

    try:
        # Ищем статью по id
        article = NewsArticle.objects.get(id=article_id)
    except NewsArticle.DoesNotExist:
        return Response(
            {"error": "Новость не найдена"}, status=status.HTTP_404_NOT_FOUND
        )

    # Определяем, какой метод использовался (PUT или PATCH)
    if request.method == "PUT":
        # Полное обновление
        serializer = NewsArticleSerializer(article, data=request.data)
    elif request.method == "PATCH":
        # Частичное обновление
        serializer = NewsArticleSerializer(
            article, data=request.data, partial=True)

    # Проверяем валидность данных
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
