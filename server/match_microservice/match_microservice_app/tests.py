from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from common.testing import ADMIN, FAN, use_local_cache

from .models import Match


@use_local_cache
class MatchTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.match = Match.objects.create(
            team_home="Кокос",
            team_away_name="Гости",
            score_home=2,
            score_away=1,
            location="Москва",
            division="A",
        )

    def test_delete_is_admin_only_and_list_is_fresh(self):
        self.assertEqual(len(self.client.get("/api/match/get_all/").json()), 1)  # cached

        self.assertEqual(self.client.delete(f"/api/match/delete/{self.match.id}/").status_code, 401)
        self.assertEqual(self.client.delete(f"/api/match/delete/{self.match.id}/", **FAN).status_code, 403)
        self.assertEqual(self.client.delete(f"/api/match/delete/{self.match.id}/", **ADMIN).status_code, 204)

        self.assertEqual(self.client.get("/api/match/get_all/").json(), [])
