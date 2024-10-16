from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication

from ...models import CartItem
from ...serializers import CartItemSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получение всех товаров из корзины пользователя с указанием размера, описания и изображений",
    tags=["cartHandlers"],
    responses={
        200: openapi.Response(description="Товары успешно получены", schema=CartItemSerializer(many=True)),
        401: openapi.Response(description="Не авторизован"),
        403: openapi.Response(description="Доступ запрещен"),
    },
)
@api_view(["GET"])
@authentication_classes([JWTTokenUserAuthentication])
@permission_classes([IsAuthenticated])
def get_all_items_from_cart(request):
    user_id = request.user.id
    cart_items = CartItem.objects.filter(user_id=user_id)
    serializer = CartItemSerializer(cart_items, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
