# Generated by Django 5.1.1 on 2024-09-15 02:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_chatmessage_voice_id"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="messages",
            name="voice_id",
        ),
    ]
