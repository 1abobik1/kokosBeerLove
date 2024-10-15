import re
from datetime import timedelta

import jwt  # PyJWT, installed with djangorestframework-simplejwt
from django.core import mail
from django.test import TestCase
from rest_framework.test import APIClient

from .models import CustomUser, RefreshToken, VerificationCode

PASSWORD = "Correct-Horse-42"


class SignupFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def request_code(self, email="fan@example.com", username="fan"):
        return self.client.post("/api/auth/verify-email/", {"email": email, "username": username}, format="json")

    def sent_code(self):
        return re.search(r"\d{6}", mail.outbox[-1].body).group(0)

    def signup(self, code, email="fan@example.com", username="fan", password=PASSWORD):
        return self.client.post(
            "/api/auth/signup/",
            {"username": username, "email": email, "password": password, "code": code},
            format="json",
        )

    def test_code_is_emailed_but_not_returned(self):
        response = self.request_code()
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("code", response.data)
        self.assertEqual(len(mail.outbox), 1)
        self.assertNotIn(self.sent_code(), response.content.decode())
        self.assertNotEqual(VerificationCode.objects.get().code_hash, self.sent_code())

    def test_signup_requires_the_emailed_code(self):
        self.request_code()
        self.assertEqual(self.signup(code=None).status_code, 400)
        wrong = "000000" if self.sent_code() != "000000" else "111111"
        self.assertEqual(self.signup(code=wrong).status_code, 400)
        self.assertFalse(CustomUser.objects.exists())

        response = self.signup(code=self.sent_code())
        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data)
        self.assertIn("refresh_token", response.cookies)
        self.assertTrue(response.cookies["refresh_token"]["httponly"])
        self.assertFalse(VerificationCode.objects.exists())

    def test_code_expires(self):
        self.request_code()
        VerificationCode.objects.update(created_at=VerificationCode.objects.get().created_at - timedelta(minutes=11))
        self.assertEqual(self.signup(code=self.sent_code()).status_code, 400)

    def test_code_is_blocked_after_too_many_attempts(self):
        self.request_code()
        code = self.sent_code()
        wrong = "000000" if code != "000000" else "111111"
        for _ in range(VerificationCode.MAX_ATTEMPTS):
            self.signup(code=wrong)
        self.assertEqual(self.signup(code=code).status_code, 400)

    def test_resend_is_rate_limited(self):
        self.assertEqual(self.request_code().status_code, 200)
        self.assertEqual(self.request_code().status_code, 429)

    def test_weak_password_is_rejected(self):
        self.request_code()
        response = self.signup(code=self.sent_code(), password="1")
        self.assertEqual(response.status_code, 400)
        self.assertIn("password", response.data)

    def test_taken_email_cannot_request_a_code(self):
        CustomUser.objects.create_user("fan@example.com", "fan", PASSWORD)
        self.assertEqual(self.request_code().status_code, 400)
        self.assertEqual(len(mail.outbox), 0)


class LoginLogoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user("fan@example.com", "fan", PASSWORD)

    def login(self, email="fan@example.com", password=PASSWORD):
        return self.client.post("/api/auth/login/", {"email": email, "password": password}, format="json")

    def test_wrong_email_and_wrong_password_look_the_same(self):
        wrong_password = self.login(password="nope-nope-nope")
        unknown_email = self.login(email="nobody@example.com")
        self.assertEqual(wrong_password.status_code, 401)
        self.assertEqual(unknown_email.status_code, 401)
        self.assertEqual(wrong_password.data, unknown_email.data)

    def test_login_refresh_logout(self):
        self.assertEqual(self.login().status_code, 200)
        self.assertEqual(self.client.post("/api/auth/refresh/").status_code, 200)

        self.assertEqual(self.client.post("/api/auth/logout/").status_code, 204)
        self.assertFalse(RefreshToken.objects.exists())

        # The browser drops the cookie, but a stolen copy of the token must not work either.
        response = self.client.post("/api/auth/refresh/")
        self.assertEqual(response.status_code, 401)

    def test_stolen_refresh_token_is_useless_after_logout(self):
        token = self.login().cookies["refresh_token"].value
        self.client.post("/api/auth/logout/")
        self.client.cookies["refresh_token"] = token
        self.assertEqual(self.client.post("/api/auth/refresh/").status_code, 401)

    def test_admin_flag_is_in_the_access_token(self):
        admin = CustomUser.objects.create_superuser("admin@example.com", "admin", PASSWORD)
        access = self.login(email=admin.email).data["access"]
        response = self.client.get("/api/auth/profile/get_user_data/", HTTP_AUTHORIZATION=f"Bearer {access}")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(jwt.decode(access, options={"verify_signature": False})["is_superuser"])


class CheckUploadTests(TestCase):
    URL = "/api/auth/internal/check-upload/"

    def setUp(self):
        self.client = APIClient()
        self.fan = CustomUser.objects.create_user("fan@example.com", "fan", PASSWORD)
        self.admin = CustomUser.objects.create_superuser("admin@example.com", "admin", PASSWORD)

    def check(self, user, method, path):
        headers = {"HTTP_X_ORIGINAL_URI": path, "HTTP_X_ORIGINAL_METHOD": method}
        if user is not None:
            token = self.client.post(
                "/api/auth/login/", {"email": user.email, "password": PASSWORD}, format="json"
            ).data["access"]
            headers["HTTP_AUTHORIZATION"] = f"Bearer {token}"
        return self.client.get(self.URL, **headers).status_code

    def test_anonymous_cannot_upload(self):
        self.assertEqual(self.check(None, "PUT", "/uploads/news_images/a.png"), 401)

    def test_fan_cannot_upload_content_images(self):
        self.assertEqual(self.check(self.fan, "PUT", "/uploads/news_images/a.png"), 403)
        self.assertEqual(self.check(self.fan, "DELETE", "/uploads/shop_images/a.png"), 403)

    def test_fan_can_upload_only_own_avatar(self):
        self.assertEqual(self.check(self.fan, "PUT", f"/uploads/user_avatar/{self.fan.id}_me.png"), 204)
        self.assertEqual(self.check(self.fan, "PUT", f"/uploads/user_avatar/{self.admin.id}_me.png"), 403)
        self.assertEqual(self.check(self.fan, "DELETE", f"/uploads/user_avatar/{self.fan.id}_me.png"), 403)

    def test_admin_can_manage_content_images(self):
        self.assertEqual(self.check(self.admin, "PUT", "/uploads/news_images/a.png"), 204)
        self.assertEqual(self.check(self.admin, "DELETE", "/uploads/team_logos/a.png"), 204)

    def test_path_outside_known_folders_is_rejected(self):
        self.assertEqual(self.check(self.admin, "PUT", "/uploads/../etc/passwd"), 403)
        self.assertEqual(self.check(self.admin, "PUT", "/uploads/other/a.png"), 403)
