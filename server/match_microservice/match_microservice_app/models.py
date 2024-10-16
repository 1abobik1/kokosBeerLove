from django.db import models


class Match(models.Model):
    team_home = models.CharField(max_length=500)
    team_away_name = models.CharField(max_length=500)  # Название гостевой команды
    team_away_logo_url = models.URLField(
        max_length=1000, blank=True, null=True
    )  # URL логотипа гостевой команды
    score_home = models.IntegerField()
    score_away = models.IntegerField()
    location = models.CharField(max_length=500)
    division = models.CharField(max_length=500)
    video_url = models.URLField(max_length=1000, blank=True, null=True)
    match_date = models.DateField(verbose_name="Дата матча", blank=True, null=True)
    match_time = models.TimeField(verbose_name="Время матча", blank=True, null=True)

    class Meta:
        db_table = "match"

    def __str__(self):
        return f"{
            self.team_home} vs {
            self.team_away_name} on {
            self.match_date} at {
                self.match_time}"
