# Generated by Django 4.1.3 on 2022-11-08 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0003_conversationgroup_update"),
    ]

    operations = [
        migrations.RenameField(
            model_name="conversationgroup", old_name="update", new_name="updated",
        ),
        migrations.AlterField(
            model_name="user",
            name="nickname",
            field=models.CharField(
                error_messages={"unique": "This username is already in use"},
                max_length=200,
                unique=True,
                verbose_name="username",
            ),
        ),
    ]