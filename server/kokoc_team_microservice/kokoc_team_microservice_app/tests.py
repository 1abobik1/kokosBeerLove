from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from common.testing import ADMIN, FAN, use_local_cache

from .models import Player


@use_local_cache
class PlayerTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.player = Player.objects.create(first_name="Иван", last_name="Иванов", role="вратарь")

    def names(self):
        return [player["last_name"] for player in self.client.get("/api/kokoc_team/get_all_players/").json()]

    def test_delete_is_admin_only_and_list_is_fresh(self):
        self.assertEqual(self.names(), ["Иванов"])  # cached

        url = f"/api/kokoc_team/delete_player/{self.player.id}/"
        self.assertEqual(self.client.delete(url).status_code, 401)
        self.assertEqual(self.client.delete(url, **FAN).status_code, 403)
        self.assertEqual(self.client.delete(url, **ADMIN).status_code, 204)

        self.assertEqual(self.names(), [])

    def test_club_info_update_is_admin_only(self):
        url = "/api/kokoc_team/info_club/update/"
        self.assertEqual(self.client.patch(url, {"wins": 5}, format="json", **FAN).status_code, 403)
        self.assertEqual(self.client.patch(url, {"wins": 5}, format="json", **ADMIN).status_code, 200)
        self.assertEqual(self.client.get("/api/kokoc_team/get_info_club/").json()["wins"], 5)
