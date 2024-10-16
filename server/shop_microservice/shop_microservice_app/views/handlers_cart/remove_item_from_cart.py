from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication

from ...models import CartItem


@swagger_auto_schema(
    method="delete",
    operation_description="Удаление товара из корзины по ID элемента корзины",
    tags=["cartHandlers"],
    manual_parameters=[
        openapi.Parameter(
            "cart_item_id", openapi.IN_PATH, description="ID элемента корзины", type=openapi.TYPE_INTEGER
        ),
        openapi.Parameter("size", openapi.IN_QUERY, description="Размер товара", type=openapi.TYPE_STRING),
    ],
    responses={
        204: openapi.Response(description="Товар успешно удален из корзины"),
        400: openapi.Response(description="Некорректные данные запроса"),
        404: openapi.Response(description="Товар не найден в корзине"),
        401: openapi.Response(description="Не авторизован"),
        403: openapi.Response(description="Доступ запрещен"),
    },
)
@api_view(["DELETE"])
@authentication_classes([JWTTokenUserAuthentication])
@permission_classes([IsAuthenticated])
def remove_item_from_cart(request, cart_item_id):
    user_id = request.user.id
    size = request.query_params.get("size", "").upper()  # Получаем размер товара из запроса

    if not size:
        return Response({"error": "Размер товара должен быть указан"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Пытаемся найти товар в корзине по user_id и cart_item_id
        cart_item = CartItem.objects.get(user_id=user_id, id=cart_item_id, size__size=size)

        # Если количество товара больше 1, уменьшаем количество
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
        else:
            # Если количество товара 1, удаляем запись
            cart_item.delete()

        return Response({"message": "Товар успешно удален из корзины"}, status=status.HTTP_204_NO_CONTENT)

    except CartItem.DoesNotExist:
        return Response({"error": "Товар не найден в корзине"}, status=status.HTTP_404_NOT_FOUND)
