from django.contrib.postgres.fields import ArrayField
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.PositiveIntegerField(default=1000)
    discount = models.PositiveIntegerField(default=0)  # Скидка в процентах
    category = models.CharField(max_length=255, choices=[("Одежда", "Одежда"), ("Аксессуары", "Аксессуары")])
    url_images = ArrayField(models.CharField(max_length=500), blank=True, default=list)

    class Meta:
        db_table = "shop_products"

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    SIZE_CHOICES = [("XS", "XS"), ("S", "S"), ("M", "M"), ("L", "L"), ("XL", "XL"), ("XXL", "XXL")]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sizes")
    size = models.CharField(max_length=3, choices=SIZE_CHOICES)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "product_sizes"
        unique_together = (
            "product",
            "size",
        )  # Один и тот же размер не может быть добавлен дважды для одного товара

    def __str__(self):
        return f"{self.size} - {self.quantity} шт."


class Order(models.Model):
    user_id = models.PositiveIntegerField()  # ID пользователя, извлеченный из JWT токена
    products = models.ManyToManyField(Product, through="OrderItem")
    total_price = models.PositiveIntegerField()
    status = models.CharField(
        max_length=50, choices=[("Обработан", "Обработан"), ("В ожидании", "В ожидании")]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Order"

    def __str__(self):
        return f"Order {self.id} - User {self.user_id}"


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "order_items"

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class CartItem(models.Model):
    user_id = models.PositiveIntegerField()  # ID пользователя из JWT
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Связь с таблицей Product
    size = models.ForeignKey(ProductSize, on_delete=models.CASCADE)  # Связь с таблицей ProductSize
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "cart_items"

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Size: {self.size.size}) for user {self.user_id}"
