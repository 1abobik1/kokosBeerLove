from django.db import transaction
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication

from ...models import CartItem
from ...serializers import AddToCartSerializer


@swagger_auto_schema(
    method='post',
    operation_description="Добавление товара с размером в корзину пользователя",
    tags=['cartHandlers'],
    request_body=AddToCartSerializer,
    responses={
        201: openapi.Response(description="Товар успешно добавлен в корзину"),
        400: openapi.Response(description="Некорректные данные запроса"),
        401: openapi.Response(description="Не авторизован"),
        403: openapi.Response(description="Доступ запрещен"),
    }
)
@api_view(['POST'])
@authentication_classes([JWTTokenUserAuthentication])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user_id = request.user.id
    serializer = AddToCartSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    product = serializer.validated_data['product']
    quantity = serializer.validated_data['quantity']
    size = serializer.validated_data['size_instance']

    with transaction.atomic():
        cart_item, created = CartItem.objects.select_for_update().get_or_create(
            user_id=user_id, product=product, size=size, defaults={'quantity': 0}
        )
        new_quantity = cart_item.quantity + quantity
        if new_quantity > size.quantity:
            if created:
                cart_item.delete()
            return Response(
                {"error": f"Размер {size.size}: на складе только {size.quantity} шт., в корзине уже {new_quantity - quantity}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        cart_item.quantity = new_quantity
        cart_item.save()

    return Response({"message": f"Товар ({size.size}) успешно добавлен в корзину"}, status=status.HTTP_201_CREATED)
