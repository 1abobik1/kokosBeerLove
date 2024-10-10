# Generated by Django 4.2.16 on 2024-10-10 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('middle_name', models.CharField(blank=True, max_length=100, null=True)),
                ('role', models.CharField(choices=[('защитник', 'Защитник'), ('нападающий', 'Нападающий'), ('вратарь', 'Вратарь'), ('полузащитник', 'Полузащитник')], max_length=20)),
                ('games_played', models.PositiveIntegerField(default=0)),
                ('goals_scored', models.PositiveIntegerField(default=0)),
                ('assists_made', models.PositiveIntegerField(default=0)),
                ('yellow_cards', models.PositiveIntegerField(default=0)),
                ('red_cards', models.PositiveIntegerField(default=0)),
                ('photo_url', models.URLField(blank=True, max_length=500)),
            ],
            options={
                'db_table': 'kokoc_players',
            },
        ),
    ]
