from django.db import migrations, models


class Migration(migrations.Migration):
    """Store only a hash of the sign-up code and count wrong attempts. Old plain-text codes are dropped."""

    dependencies = [
        ("auth_microservice_app", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL("DELETE FROM auth_microservice_app_verificationcode", migrations.RunSQL.noop),
        migrations.RemoveField(model_name="verificationcode", name="code"),
        migrations.AddField(
            model_name="verificationcode",
            name="code_hash",
            field=models.CharField(default="", max_length=64),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="verificationcode",
            name="attempts",
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="verificationcode",
            name="email",
            field=models.EmailField(db_index=True, max_length=254),
        ),
    ]
