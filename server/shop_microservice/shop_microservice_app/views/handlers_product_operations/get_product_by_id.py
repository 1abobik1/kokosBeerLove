from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Product
from ...serializers import ProductSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получение конкретного товара по ID",
    tags=["productHandlers"],
    responses={
        200: openapi.Response(description="Успешный ответ с данными товара", schema=ProductSerializer),
        404: openapi.Response(description="Товар не найден"),
    },
)
@cache_page(60 * 20)
@api_view(["GET"])
def get_product_by_id(request, product_id):
    try:
        # Получаем конкретный товар по id
        product = Product.objects.get(id=product_id)

        # Сериализуем данные с полями material, color, size
        serializer = ProductSerializer(product)

        # Возвращаем успешный ответ с данными товара
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Товар не найден"}, status=status.HTTP_404_NOT_FOUND)
