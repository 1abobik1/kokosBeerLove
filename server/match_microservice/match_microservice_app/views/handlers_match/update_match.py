from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken
from ...models import Match
from ...serializers import MatchCreateSerializer


@swagger_auto_schema(
    method="put",
    operation_description="Полное обновление информации о матче. Доступно только администраторам (is_superuser == true).",
    tags=["Create Update Delete"],
    request_body=MatchCreateSerializer,
    responses={
        200: openapi.Response(
            description="Информация о матче успешно обновлена"),
        400: openapi.Response(
            description="Неправильные данные"),
        401: openapi.Response(
            description="Неавторизован. Необходимо передать токен доступа."),
        403: openapi.Response(
            description="У вас нет прав для изменения информации (нужен is_superuser)."),
        404: openapi.Response(
            description="Матч не найден"),
    },
)
@swagger_auto_schema(
    method="patch",
    operation_description="Частичное обновление информации о матче. Доступно только администраторам (is_superuser == true).",
    tags=["Create Update Delete"],
    request_body=MatchCreateSerializer,
    responses={
        200: openapi.Response(
            description="Информация о матче успешно частично обновлена"),
        400: openapi.Response(
            description="Неправильные данные"),
        401: openapi.Response(
            description="Неавторизован. Необходимо передать токен доступа."),
        403: openapi.Response(
            description="У вас нет прав для изменения информации (нужен is_superuser)."),
        404: openapi.Response(
            description="Матч не найден"),
    },
)
@api_view(["PUT", "PATCH"])
@permission_classes([IsAdminToken])
def update_match(request, match_id):

    try:
        match = Match.objects.get(id=match_id)
    except Match.DoesNotExist:
        return Response({"error": "Матч не найден"},
                        status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = MatchCreateSerializer(match, data=request.data)
    elif request.method == "PATCH":
        serializer = MatchCreateSerializer(
            match, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
