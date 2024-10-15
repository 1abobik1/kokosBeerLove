from rest_framework.permissions import BasePermission


class IsAdminToken(BasePermission):
    """Allows access only to administrators: a valid JWT with is_superuser == true in its payload."""

    message = "Доступ запрещён: действие доступно только администраторам."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_superuser", False))
