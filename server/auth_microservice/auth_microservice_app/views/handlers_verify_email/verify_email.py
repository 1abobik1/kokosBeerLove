from django.core.mail import send_mail
from random import randint
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from ...serializers import EmailVerificationSerializer
from django.core.mail import BadHeaderError
from smtplib import SMTPException
from ...models import CustomUser
import logging

# Логирование ошибок
logger = logging.getLogger(__name__)


@swagger_auto_schema(
    method='post',
    operation_description="Отправка кода подтверждения на email. Код отправляется только на @mail.ru",
    tags=["verifyEmailHandlers"],
    request_body=EmailVerificationSerializer,
    responses={
        200: openapi.Response(description="Код отправлен на почту", examples={
            "application/json": {
                "code": "123456"
            }
        }),
        400: openapi.Response(description="Некорректный email, email уже существует или имя уже занято"),
        500: openapi.Response(description="Внутренняя ошибка сервера (Internal Server Error)")
    }
)
@api_view(['POST'])
def verify_email(request):
    serializer = EmailVerificationSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        username = serializer.validated_data.get('username', None)

        # Проверка, существует ли пользователь с таким email в базе данных
        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {"detail": "Пользователь с таким email уже зарегистрирован."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка, существует ли пользователь с таким именем в базе данных
        if username and CustomUser.objects.filter(username=username).exists():
            return Response(
                {"detail": "Пользователь с таким именем уже зарегистрирован."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Генерация случайного 6-значного кода
        code = randint(100000, 999999)

        try:
            # Отправка кода на email
            send_mail(
                'Подтверждение регистрации',
                f'Ваш код подтверждения: {code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except (BadHeaderError, SMTPException) as e:
            # Логируем ошибку для администраторов, чтобы не потерять детали
            logger.error(f"Ошибка при отправке email: {str(e)}")

            # Возвращаем ответ с ошибкой 500
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Отправляем код клиенту для дальнейшей обработки
        return Response({'code': code}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
