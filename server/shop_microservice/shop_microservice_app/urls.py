from django.urls import path

from .views.handlers_cart.add_to_cart import add_to_cart
from .views.handlers_cart.get_all_items_from_cart import get_all_items_from_cart
from .views.handlers_cart.remove_item_from_cart import remove_item_from_cart
from .views.handlers_product_operations.create_product import create_product
from .views.handlers_product_operations.delete_product import delete_product
from .views.handlers_product_operations.get_all_products import get_all_products
from .views.handlers_product_operations.get_product_by_id import get_product_by_id
from .views.handlers_product_operations.update_product import update_product

urlpatterns = [
    path("create_product/", create_product, name="create_product"),
    path("update_product/<int:product_id>/", update_product, name="update_product"),
    path("get_all/", get_all_products, name="get_all_products"),
    path("<int:product_id>/", get_product_by_id, name="get_product_by_id"),
    path("delete_product/<int:product_id>/", delete_product, name="delete_product"),
    path("add_to_cart/", add_to_cart, name="add_to_cart"),
    path("remove_item_from_cart/<int:cart_item_id>/", remove_item_from_cart, name="remove_item_from_cart"),
    path("get_all_items_from_cart/", get_all_items_from_cart, name="get_all_items_from_cart"),
]
