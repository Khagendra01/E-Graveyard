# Generated by Django 5.1.1 on 2024-09-14 22:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_alter_messages_ai_msg"),
    ]

    operations = [
        migrations.AlterField(
            model_name="graveimages",
            name="image",
            field=models.CharField(max_length=255),
        ),
    ]
