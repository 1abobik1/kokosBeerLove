from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken

from ...serializers import ProductCreateSerializer


@swagger_auto_schema(
    method="post",
    operation_description="Создание нового товара с указанием размеров и их количества",
    tags=["productHandlers"],
    request_body=ProductCreateSerializer,
    responses={
        201: openapi.Response(description="Товар успешно создан"),
        400: openapi.Response(description="Неправильные данные"),
        401: openapi.Response(description="Неавторизован"),
        403: openapi.Response(description="Нет прав доступа"),
    },
)
@api_view(["POST"])
@permission_classes([IsAdminToken])
def create_product(request):

    serializer = ProductCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
