import logging
import secrets
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import BadHeaderError, send_mail
from django.utils import timezone
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import CustomUser, VerificationCode
from ...serializers import EmailVerificationSerializer

logger = logging.getLogger(__name__)


@swagger_auto_schema(
    method="post",
    operation_description=(
        "Отправка 6-значного кода подтверждения на email. Код действует 10 минут, "
        "повторная отправка — не чаще раза в минуту. Код в ответе не возвращается."
    ),
    tags=["verifyEmailHandlers"],
    request_body=EmailVerificationSerializer,
    responses={
        200: openapi.Response(description="Код отправлен на почту"),
        400: openapi.Response(description="Некорректный email, email или имя уже заняты"),
        429: openapi.Response(description="Код уже отправлен, повторите позже"),
        500: openapi.Response(description="Не удалось отправить письмо"),
    },
)
@api_view(["POST"])
def verify_email(request):
    serializer = EmailVerificationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = CustomUser.objects.normalize_email(serializer.validated_data["email"])
    username = serializer.validated_data["username"]

    if CustomUser.objects.filter(email__iexact=email).exists():
        return Response(
            {"detail": "Пользователь с таким email уже зарегистрирован."}, status=status.HTTP_400_BAD_REQUEST
        )
    if CustomUser.objects.filter(username=username).exists():
        return Response(
            {"detail": "Пользователь с таким именем уже зарегистрирован."}, status=status.HTTP_400_BAD_REQUEST
        )

    last = VerificationCode.objects.filter(email__iexact=email).order_by("-created_at").first()
    if last and timezone.now() < last.created_at + VerificationCode.RESEND_INTERVAL:
        return Response(
            {"detail": "Код уже отправлен. Повторить можно через минуту."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    code = f"{secrets.randbelow(1_000_000):06d}"
    try:
        send_mail(
            "Подтверждение регистрации",
            f"Ваш код подтверждения: {code}\nКод действует 10 минут.",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
    except (BadHeaderError, SMTPException, OSError) as error:
        logger.error("Ошибка при отправке email: %s", error)
        return Response(
            {"detail": "Не удалось отправить письмо."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Only the latest code is valid.
    VerificationCode.objects.filter(email__iexact=email).delete()
    VerificationCode.objects.create(email=email, code_hash=VerificationCode.hash_code(code))
    return Response({"detail": "Код отправлен на почту."}, status=status.HTTP_200_OK)
