# Generated by Django 4.2.16 on 2024-10-10 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop_microservice_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='price',
            field=models.PositiveIntegerField(default=1000),
        ),
    ]
