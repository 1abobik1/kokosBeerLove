from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken

from ...models import NewsArticle


@swagger_auto_schema(
    method="delete",
    operation_description="Удаление новости по ID. ВАЖНО ПЕРЕДАТЬ access token, если в payload будет is_superuser == true(то пользователь-администратор), иначе ответит 401 или 403",
    tags=["NewsArticle"],
    manual_parameters=[
        openapi.Parameter(
            "article_id",
            openapi.IN_PATH,
            description="ID статьи",
            type=openapi.TYPE_INTEGER,
        ),
    ],
    responses={
        204: openapi.Response(description="Новость успешно удалена"),
        401: openapi.Response(
            description="Неавторизован, нужно перенаправить со стороны frontend в перехватчик api/refresh/ другого микросервиса"
        ),
        403: openapi.Response(description="Нет прав на удаление"),
        404: openapi.Response(description="Новость не найдена"),
    },
)
@api_view(["DELETE"])
@permission_classes([IsAdminToken])
def delete_news_article(request, article_id):

    try:
        article = NewsArticle.objects.get(id=article_id)

        # Если необходимо, можно также удалить файл изображения с сервера
        # Но так как мы храним только путь к изображению и не используем default_storage,
        # удаление файла должно быть реализовано отдельно, если требуется.
        # Например, можно добавить проверку и удалить файл, если он находится в
        # разрешенной директории.

        # Удаляем запись из базы данных
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except NewsArticle.DoesNotExist:
        return Response({"error": "Новость не найдена"}, status=status.HTTP_404_NOT_FOUND)
