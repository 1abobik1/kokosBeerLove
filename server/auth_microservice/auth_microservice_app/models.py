import hashlib
import hmac
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("У пользователя должен быть email")
        if not username:
            raise ValueError("У пользователя должно быть имя (username)")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)  # Хеширование пароля
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password)
        user.is_superuser = True
        user.is_staff = True  # Даем доступ к админке
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        unique=True,
        error_messages={
            "unique": "Email уже занят.",
        },
    )
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={
            "unique": "Никнейм уже занят.",
        },
    )
    password = models.CharField(max_length=128)  # Хешированный пароль
    first_name = models.CharField(max_length=150, blank=True)  # Имя
    last_name = models.CharField(max_length=150, blank=True)  # Фамилия
    phone_number = models.CharField(max_length=15, blank=True)  # Номер телефона
    telegram = models.CharField(max_length=100, blank=True)  # Telegram
    avatar_url = models.URLField(blank=True)  # URL для аватара
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)  # Подтверждение email

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "site_users"

    def __str__(self):
        return self.email


class RefreshToken(models.Model):
    """Issued refresh tokens. A token absent from this table is rejected by refresh/, so logout just deletes it."""

    LIFETIME = timedelta(days=60)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Refresh token for {self.user.email}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at


class VerificationCode(models.Model):
    """A sign-up code sent by email. Only its SHA-256 is stored; it expires and allows a few attempts."""

    TTL = timedelta(minutes=10)
    RESEND_INTERVAL = timedelta(seconds=60)
    MAX_ATTEMPTS = 5

    email = models.EmailField(db_index=True)
    code_hash = models.CharField(max_length=64)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def hash_code(code):
        return hashlib.sha256(code.encode()).hexdigest()

    def matches(self, code):
        return hmac.compare_digest(self.code_hash, self.hash_code(code))

    @property
    def is_expired(self):
        return timezone.now() > self.created_at + self.TTL

    def __str__(self):
        return f"Verification code for {self.email}"
