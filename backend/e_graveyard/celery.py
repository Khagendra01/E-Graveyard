import os

from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_graveyard.settings")

app = Celery("e_graveyard")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()