from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken
from ...models import Product


@swagger_auto_schema(
    method="delete",
    operation_description="Удаление товара по ID. ВАЖНО ПЕРЕДАТЬ access token, если в payload будет is_superuser == true(то пользователь-администратор), иначе ответит 401 или 403",
    tags=['productHandlers'],
    manual_parameters=[
        openapi.Parameter(
            "product_id",
            openapi.IN_PATH,
            description="ID товара",
            type=openapi.TYPE_INTEGER,
        ),
    ],
    responses={
        204: openapi.Response(
            description="Товар успешно удален"),
        401: openapi.Response(
            description="Неавторизован, нужно перенаправить со стороны frontend в перехватчик api/refresh/ другого микросервиса"),
        403: openapi.Response(
            description="Нет прав на удаление"),
        404: openapi.Response(
            description="Товар не найден"),
    },
)
@api_view(["DELETE"])
@permission_classes([IsAdminToken])
def delete_product(request, product_id):

    try:
        product = Product.objects.get(id=product_id)

        # Удаляем запись из базы данных
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({"error": "Товар не найден"},
                        status=status.HTTP_404_NOT_FOUND)
