from django.db import models


class Player(models.Model):
    ROLE_CHOICES = [
        ("защитник", "Защитник"),
        ("нападающий", "Нападающий"),
        ("вратарь", "Вратарь"),
        ("полузащитник", "Полузащитник"),
    ]

    first_name = models.CharField(max_length=100)  # Имя
    last_name = models.CharField(max_length=100)  # Фамилия
    middle_name = models.CharField(max_length=100, blank=True, null=True)  # Отчество (может быть пустым)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)  # Роль
    games_played = models.PositiveIntegerField(default=0)  # Сыграно игр
    goals_scored = models.PositiveIntegerField(default=0)  # Забито голов
    assists_made = models.PositiveIntegerField(default=0)  # Отдано пасов
    yellow_cards = models.PositiveIntegerField(default=0)  # Желтые карточки
    red_cards = models.PositiveIntegerField(default=0)  # Красные карточки
    photo_url = models.URLField(max_length=500, blank=True)  # URL фотографии игрока

    class Meta:
        db_table = "kokoc_players"

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"


class AboutFcKokoc(models.Model):
    games_played = models.IntegerField(verbose_name="Количество игр", default=0)
    wins = models.IntegerField(verbose_name="Победы", default=0)
    goals_scored = models.IntegerField(verbose_name="Голы", default=0)
    tournaments = models.IntegerField(verbose_name="Турниры", default=0)
    about_text = models.TextField(verbose_name="Информация о команде", blank=True, null=True)

    class Meta:
        db_table = "about_fc_kokoc"
        verbose_name = "О клубе"
        verbose_name_plural = "О клубе"

    @classmethod
    def get_instance(cls):
        # Метод получения или создания единственной записи
        instance, created = cls.objects.get_or_create(pk=1)
        return instance

    def save(self, *args, **kwargs):
        self.pk = 1  # Всегда сохраняем запись с PK 1
        super(AboutFcKokoc, self).save(*args, **kwargs)

    def __str__(self):
        return f"Информация о клубе (Игры: {
            self.games_played}, Победы: {
            self.wins})"
