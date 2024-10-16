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
    operation_description="Получение всех товаров",
    tags=["productHandlers"],
    responses={
        200: openapi.Response(
            description="Успешный ответ с данными всех товаров",
            schema=ProductSerializer(many=True),
        ),
    },
)
@cache_page(60 * 20)
@api_view(["GET"])
def get_all_products(request):
    # Получаем все товары из базы данных
    products = Product.objects.all()

    # Используем сериализатор с полным набором данных
    serializer = ProductSerializer(products, many=True)

    # Возвращаем успешный ответ с данными товаров
    return Response(serializer.data, status=status.HTTP_200_OK)
