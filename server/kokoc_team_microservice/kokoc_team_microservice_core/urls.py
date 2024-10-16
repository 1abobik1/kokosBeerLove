from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version="v1",
        description="Все запросы начинаются с http://127.0.0.1:8000/api/kokoc_team/ если сервер локальный и на порту 8000",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("swagger.json/", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("api/kokoc_team/", include("kokoc_team_microservice_app.urls")),
]
