from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from common.permissions import IsAdminToken
from ...models import Match


@swagger_auto_schema(
    method='delete',
    tags=["Create Update Delete"],
    operation_description="Удаление матча по его ID. Доступно только администраторам (is_superuser == true).",
    responses={
        204: openapi.Response(description="Матч успешно удален"),
        404: openapi.Response(description="Матч не найден"),
        403: openapi.Response(description="Нет прав доступа"),
    }
)
@api_view(['DELETE'])
@permission_classes([IsAdminToken])
def delete_match_by_id(request, match_id):

    try:
        # Ищем матч по id
        match = Match.objects.get(id=match_id)
        match.delete()  # Удаляем матч
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Match.DoesNotExist:
        return Response({'error': 'Матч не найден'}, status=status.HTTP_404_NOT_FOUND)
