# Generated by Django 5.1.2 on 2024-10-09 20:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('match_microservice_app', '0004_remove_match_match_date_time_match_match_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='match',
            name='about_text',
        ),
    ]
