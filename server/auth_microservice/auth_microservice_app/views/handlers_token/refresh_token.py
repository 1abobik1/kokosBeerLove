from django.utils import timezone
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken as JWTRefreshToken

from ...models import RefreshToken as RefreshTokenModel


@swagger_auto_schema(
    method='post',
    operation_description="Обновление access токена с использованием refresh токена, который передается в Cookie. "
                          "Refresh токен должен быть передан в cookie с именем 'refresh_token'.",
    tags=["tokenHandlers"],
    responses={
        200: openapi.Response(description="Новый access токен", examples={
            "application/json": {
                "access": "новый access токен"
            }
        }),
        401: openapi.Response(description="Недействительный или отсутствующий refresh токен")
    }
)

@api_view(['POST'])
def refresh_token(request):
    refresh_token = request.COOKIES.get('refresh_token')  # Получаем refresh токен из cookie

    if not refresh_token:
        return Response({'error': 'Refresh токен не предоставлен'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        # Проверяем валидность refresh токена
        token = JWTRefreshToken(refresh_token)

        # Проверка наличия токена в базе данных
        try:
            db_token = RefreshTokenModel.objects.get(token=refresh_token)
        except RefreshTokenModel.DoesNotExist:
            return Response({'error': 'Refresh токен не найден в базе данных'}, status=status.HTTP_401_UNAUTHORIZED)

        # Проверка истечения токена в базе данных
        if db_token.expires_at < timezone.now():
            return Response({'error': 'Refresh токен истек'}, status=status.HTTP_401_UNAUTHORIZED)

        # Генерация нового access токена
        new_access_token = token.access_token

        # Возвращаем новый access токен
        return Response({
            'access': str(new_access_token)
        }, status=status.HTTP_200_OK)

    except Exception:
        return Response({'error': 'Недействительный refresh токен'}, status=status.HTTP_401_UNAUTHORIZED)