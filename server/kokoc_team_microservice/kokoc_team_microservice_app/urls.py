from django.urls import path

from .views.handlers_about_fckokoc.get_info_fc_kokoc import get_info_fc_kokoc
from .views.handlers_about_fckokoc.update_info_fc_kokoc import update_info_fc_kokoc
from .views.handlers_players.create_player import create_player
from .views.handlers_players.delete_player_by_id import delete_player_by_id
from .views.handlers_players.get_all_players import get_all_players
from .views.handlers_players.get_player_by_id import get_player_by_id
from .views.handlers_players.update_player import update_player

urlpatterns = [
    path("get_all_players/", get_all_players, name="get_all_players"),
    path("get_player/<int:player_id>/", get_player_by_id, name="get_player_by_id"),
    path("delete_player/<int:id>/", delete_player_by_id, name="delete_player_by_id"),
    path("create_player/", create_player, name="create_player"),
    path("update_player/<int:player_id>/", update_player, name="update_player"),
    path("get_info_club/", get_info_fc_kokoc, name="get_info_fc_kokoc"),
    path("info_club/update/", update_info_fc_kokoc, name="update_info_fc_kokoc"),
]
