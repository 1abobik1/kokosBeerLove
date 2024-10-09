from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models import AboutFcKokoc
from ...serializers import AboutFcKokocSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@swagger_auto_schema(
    method='get',
    operation_description="Получение информации о клубе. Для просмотра данных авторизация не обязательна.",
    responses={
        200: openapi.Response(description="Информация о клубе успешно получена"),
        404: openapi.Response(description="Информация о клубе не найдена")
    }
)
@api_view(['GET'])
def get_about_fc_kokoc(request):
    try:
        about_fc_kokoc = AboutFcKokoc.objects.first()
        serializer = AboutFcKokocSerializer(about_fc_kokoc)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except AboutFcKokoc.DoesNotExist:
        return Response({'error': 'Информация о клубе не найдена'}, status=status.HTTP_404_NOT_FOUND)
