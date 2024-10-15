import re

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# Called by nginx (auth_request) before it accepts a PUT/DELETE into /uploads/.
# nginx passes the original path and method; the answer decides: 2xx - allow, 401/403 - reject.
UPLOAD_PATH = re.compile(r"^/uploads/(?P<folder>[a-z_]+)/(?P<name>[A-Za-z0-9_.-]+)$")
ADMIN_FOLDERS = {"news_images", "shop_images", "player_photos", "team_logos"}
AVATAR_FOLDER = "user_avatar"


def is_upload_allowed(user, method, folder, name):
    if user.is_superuser:
        return folder in ADMIN_FOLDERS or folder == AVATAR_FOLDER
    # A regular user may only upload their own avatar: the file name starts with "<user id>_",
    # so nobody can overwrite someone else's picture. Deleting is for administrators only.
    return method == "PUT" and folder == AVATAR_FOLDER and name.startswith(f"{user.id}_")


@api_view(["GET"])
@permission_classes([AllowAny])
def check_upload(request):
    if not request.user.is_authenticated:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    match = UPLOAD_PATH.match(request.headers.get("X-Original-URI", "").split("?", 1)[0])
    method = request.headers.get("X-Original-Method", "")
    if match is None or method not in ("PUT", "DELETE"):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if not is_upload_allowed(request.user, method, match["folder"], match["name"]):
        return Response(status=status.HTTP_403_FORBIDDEN)
    return Response(status=status.HTTP_204_NO_CONTENT)
