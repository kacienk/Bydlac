# Generated by Django 4.1.3 on 2023-01-03 14:35

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0015_alter_conversationgroup_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="expires",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2023, 1, 3, 14, 50, 9, 261863, tzinfo=datetime.timezone.utc
                )
            ),
        ),
    ]
