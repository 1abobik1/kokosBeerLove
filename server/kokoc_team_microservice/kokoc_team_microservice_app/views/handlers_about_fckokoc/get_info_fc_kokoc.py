from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import AboutFcKokoc
from ...serializers import AboutFcKokocSerializer


@swagger_auto_schema(
    method="get",
    operation_description="Получение информации о клубе. Для просмотра данных авторизация не обязательна.",
    tags=["aboutKokocHandlers"],
    responses={
        200: openapi.Response(description="Информация о клубе успешно получена"),
        404: openapi.Response(description="Информация о клубе не найдена"),
    },
)
@cache_page(60 * 20)
@api_view(["GET"])
def get_info_fc_kokoc(request):
    about_fc_kokoc = AboutFcKokoc.get_instance()  # Получаем единственную запись
    serializer = AboutFcKokocSerializer(about_fc_kokoc)
    return Response(serializer.data)
