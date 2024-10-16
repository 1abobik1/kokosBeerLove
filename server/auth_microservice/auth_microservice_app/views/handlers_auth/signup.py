from django.db import IntegrityError, transaction
from django.utils import timezone
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...custom_tokens import CustomRefreshToken
from ...models import CustomUser
from ...models import RefreshToken as RefreshTokenModel
from ...models import VerificationCode
from ...serializers import SignupSerializer
from .session import set_refresh_cookie


def _check_code(email, code):
    """Returns an error message, or None if the code sent to this email is correct."""
    verification = VerificationCode.objects.filter(email__iexact=email).order_by("-created_at").first()
    if verification is None or verification.is_expired:
        return "Код не найден или истёк. Запросите новый."
    if verification.attempts >= VerificationCode.MAX_ATTEMPTS:
        return "Слишком много неверных попыток. Запросите новый код."
    if not verification.matches(code):
        verification.attempts += 1
        verification.save(update_fields=["attempts"])
        return "Неверный код подтверждения."
    return None


@swagger_auto_schema(
    method="post",
    operation_description="Регистрация с кодом из письма (см. verify-email/). Refresh-токен ставится в httpOnly cookie.",
    tags=["authHandlers"],
    request_body=SignupSerializer,
    responses={
        201: openapi.Response(description="Пользователь зарегистрирован, в ответе access-токен"),
        400: openapi.Response(description="Некорректные данные, слабый пароль или неверный код"),
    },
)
@api_view(["POST"])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = CustomUser.objects.normalize_email(serializer.validated_data["email"])
    error = _check_code(email, serializer.validated_data.pop("code"))
    if error:
        return Response({"code": [error]}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            user = serializer.save()
            VerificationCode.objects.filter(email__iexact=email).delete()
    except IntegrityError:
        return Response(
            {"error": "Пользователь с таким email уже существует"}, status=status.HTTP_400_BAD_REQUEST
        )

    refresh = CustomRefreshToken.for_user(user)
    expires_at = timezone.now() + RefreshTokenModel.LIFETIME
    RefreshTokenModel.objects.create(user=user, token=str(refresh), expires_at=expires_at)

    response = Response({"access": str(refresh.access_token)}, status=status.HTTP_201_CREATED)
    set_refresh_cookie(response, str(refresh))
    return response
