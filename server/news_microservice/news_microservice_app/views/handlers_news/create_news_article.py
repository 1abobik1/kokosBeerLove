from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken
from ...models import NewsArticle


@swagger_auto_schema(
    method="post",
    operation_description="Создание новой новости с указанием URL изображения. ВАЖНО ПЕРЕДАТЬ access token, если в payload будет is_superuser == true(то пользователь-администратор), иначе ответит 401 или 403",
    tags=['NewsArticle'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=[
            "title",
            "text",
            "image_url"],
        properties={
            "title": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Заголовок новости"),
            "text": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Текст новости"),
            "image_url": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="URL изображения новости"),
        },
    ),
    responses={
        201: openapi.Response(
            description="Новость успешно создана"),
        400: openapi.Response(
            description="Неправильные данные"),
        401: openapi.Response(
            description="Неавторизован, нужно перенаправить со стороны frontend в перехватчик api/refresh/ другого микросервиса"),
        403: openapi.Response(
            description="Нет прав доступа"),
    },
)
@api_view(["POST"])
@permission_classes([IsAdminToken])
def create_news_article(request):

    # Проверка на наличие всех необходимых полей
    title = request.data.get("title")
    text = request.data.get("text")
    image_url = request.data.get("image_url")  # Получаем URL изображения

    if title or text or image_url:
        # Сохранение новости в базе данных с URL изображения
        NewsArticle.objects.create(title=title, text=text, image_url=image_url)
        return Response(status=status.HTTP_201_CREATED)

    # Если отсутствуют обязательные поля, возвращаем ошибку
    return Response({"error": "Отсутствуют обязательные поля"},
                    status=status.HTTP_400_BAD_REQUEST)
