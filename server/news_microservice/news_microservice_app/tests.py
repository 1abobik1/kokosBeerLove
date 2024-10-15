from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from common.testing import ADMIN, FAN, use_local_cache

ARTICLE = {"title": "Победа в финале", "text": "Кокос выиграл кубок", "image_url": "http://localhost/uploads/news_images/a.png"}


@use_local_cache
class NewsTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def titles(self):
        return [article["title"] for article in self.client.get("/api/news/get_all/").json()]

    def test_only_admin_can_create(self):
        self.assertEqual(self.client.post("/api/news/create/", ARTICLE, format="json").status_code, 401)
        self.assertEqual(self.client.post("/api/news/create/", ARTICLE, format="json", **FAN).status_code, 403)
        self.assertEqual(self.client.post("/api/news/create/", ARTICLE, format="json", **ADMIN).status_code, 201)

    def test_changes_are_visible_immediately_despite_the_cache(self):
        self.assertEqual(self.titles(), [])  # the empty list is now cached for 20 minutes

        self.client.post("/api/news/create/", ARTICLE, format="json", **ADMIN)
        self.assertEqual(self.titles(), [ARTICLE["title"]])

        article_id = self.client.get("/api/news/get_all/").json()[0]["id"]
        self.client.patch(f"/api/news/{article_id}/update/", {"title": "Новый заголовок"}, format="json", **ADMIN)
        self.assertEqual(self.titles(), ["Новый заголовок"])

        self.client.delete(f"/api/news/{article_id}/delete/", **ADMIN)
        self.assertEqual(self.titles(), [])

    def test_fan_cannot_delete(self):
        self.client.post("/api/news/create/", ARTICLE, format="json", **ADMIN)
        article_id = self.client.get("/api/news/get_all/").json()[0]["id"]
        self.assertEqual(self.client.delete(f"/api/news/{article_id}/delete/", **FAN).status_code, 403)
        self.assertEqual(len(self.titles()), 1)

    def test_public_read_works_with_a_token_too(self):
        # The default JWTAuthentication used to look the user up in this service's empty user table.
        self.assertEqual(self.client.get("/api/news/get_all/", **FAN).status_code, 200)
