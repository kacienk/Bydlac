# Generated by Django 4.1.3 on 2022-12-25 23:00

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_alter_event_expires'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='expires',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 25, 23, 15, 31, 396697)),
        ),
    ]
