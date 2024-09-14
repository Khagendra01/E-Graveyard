from django.db import models

class CustomUser(models.Model):
    email = models.EmailField(primary_key=True)
    full_name = models.CharField(max_length=255)
    image = models.URLField(max_length=255, blank=True, null=True)

class Grave(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    other_Name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=15)
    is_alive = models.BooleanField()
    content = models.TextField()
    dob = models.DateTimeField()
    dod = models.DateTimeField(blank=True, null=True)
    voice_id = models.CharField(max_length=255, blank=True, null=True)
    owner = models.EmailField()

class GraveImages(models.Model):
    grave = models.IntegerField()
    image = models.URLField(max_length=255)
    owner = models.EmailField()

class GraveVisitors(models.Model):
    grave = models.IntegerField()
    visitor = models.EmailField()
    message = models.TextField()
    gift = models.URLField(max_length=255, blank=True, null=True)

class ChatMessage(models.Model):
    user = models.EmailField()
    grave = models.IntegerField()

class Messages(models.Model):
    message = models.IntegerField()
    user_msg = models.TextField()
    ai_msg = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

