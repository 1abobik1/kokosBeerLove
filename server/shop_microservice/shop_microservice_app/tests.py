from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from common.testing import ADMIN, FAN, use_local_cache

PRODUCT = {
    "name": "Худи Кокос",
    "description": "Тёплое худи",
    "price": 3000,
    "discount": 0,
    "category": "Одежда",
    "url_images": [],
    "sizes": [{"size": "M", "quantity": 2}],
}


@use_local_cache
class ShopTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.assertEqual(self.client.post("/api/shop/create_product/", PRODUCT, format="json", **ADMIN).status_code, 201)
        self.product_id = self.client.get("/api/shop/get_all/").json()[0]["id"]

    def add(self, quantity, size="M"):
        body = {"product": self.product_id, "quantity": quantity, "size": size}
        return self.client.post("/api/shop/add_to_cart/", body, format="json", **FAN)

    def test_only_admin_manages_products(self):
        self.assertEqual(self.client.post("/api/shop/create_product/", PRODUCT, format="json", **FAN).status_code, 403)
        self.assertEqual(self.client.delete(f"/api/shop/delete_product/{self.product_id}/", **FAN).status_code, 403)

    def test_update_returns_the_product_and_list_is_fresh(self):
        response = self.client.patch(
            f"/api/shop/update_product/{self.product_id}/", {"price": 2500}, format="json", **ADMIN
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["price"], 2500)
        self.assertEqual(self.client.get("/api/shop/get_all/").json()[0]["price"], 2500)

    def test_cart_cannot_exceed_stock(self):
        self.assertEqual(self.add(2).status_code, 201)
        response = self.add(1)
        self.assertEqual(response.status_code, 400)
        self.assertIn("на складе только 2", response.json()["error"])
        cart = self.client.get("/api/shop/get_all_items_from_cart/", **FAN).json()
        self.assertEqual([item["quantity"] for item in cart], [2])

    def test_stock_from_the_admin_panel_is_saved(self):
        sizes = self.client.get(f"/api/shop/{self.product_id}/").json()["sizes"]
        self.assertEqual(sizes, [{"size": "M", "quantity": 2}])

    def test_cart_rejects_zero_quantity_and_unknown_size(self):
        self.assertEqual(self.add(0).status_code, 400)
        self.assertEqual(self.add(1, size="XXL").status_code, 400)

    def test_cart_needs_login(self):
        body = {"product": self.product_id, "quantity": 1, "size": "M"}
        self.assertEqual(self.client.post("/api/shop/add_to_cart/", body, format="json").status_code, 401)
