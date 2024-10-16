from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken

from ...models import Product
from ...serializers import ProductCreateSerializer, ProductSerializer


@swagger_auto_schema(
    method="put",
    operation_description="Полное обновление существующего товара. ВАЖНО ПЕРЕДАТЬ access token, если в payload будет is_superuser == true (то пользователь-администратор), иначе ответит 401 или 403",
    tags=["productHandlers"],
    manual_parameters=[
        openapi.Parameter("product_id", openapi.IN_PATH, description="ID товара", type=openapi.TYPE_INTEGER)
    ],
    request_body=ProductCreateSerializer,
    responses={
        200: openapi.Response(description="Товар успешно обновлен", schema=ProductSerializer),
        404: openapi.Response(description="Товар не найден"),
        400: openapi.Response(description="Неправильные данные"),
        401: openapi.Response(description="Неавторизован"),
        403: openapi.Response(description="Нет прав доступа"),
    },
)
@swagger_auto_schema(
    method="patch",
    operation_description="Частичное обновление существующего товара. ВАЖНО ПЕРЕДАТЬ access token, если в payload будет is_superuser == true (то пользователь-администратор), иначе ответит 401 или 403",
    tags=["productHandlers"],
    manual_parameters=[
        openapi.Parameter("product_id", openapi.IN_PATH, description="ID товара", type=openapi.TYPE_INTEGER)
    ],
    request_body=ProductCreateSerializer,
    responses={
        200: openapi.Response(description="Товар успешно частично обновлен", schema=ProductSerializer),
        404: openapi.Response(description="Товар не найден"),
        400: openapi.Response(description="Неправильные данные"),
        401: openapi.Response(description="Неавторизован"),
        403: openapi.Response(description="Нет прав доступа"),
    },
)
@api_view(["PUT", "PATCH"])
@permission_classes([IsAdminToken])
def update_product(request, product_id):

    try:
        # Find the product by ID
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Товар не найден"}, status=status.HTTP_404_NOT_FOUND)

    # Handle full or partial update
    if request.method == "PUT":
        serializer = ProductCreateSerializer(product, data=request.data)
    else:  # PATCH
        serializer = ProductCreateSerializer(product, data=request.data, partial=True)

    if serializer.is_valid():
        product = serializer.save()  # Save the updated product
        response_serializer = ProductSerializer(product)  # Serialize the updated product
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
