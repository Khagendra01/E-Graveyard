from django.db import models

class CustomUser(models.Model):
    email = models.EmailField(unique=True)
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
    grave = models.ForeignKey(Grave, on_delete=models.CASCADE)
    image = models.URLField(max_length=255)
    owner = models.EmailField()

class GraveVisitors(models.Model):
    grave = models.ForeignKey(Grave, on_delete=models.CASCADE)
    visitor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    gift = models.URLField(max_length=255, blank=True, null=True)

class ChatMessage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chat_messages')
    grave = models.ForeignKey(Grave, on_delete=models.CASCADE)

class Messages(models.Model):
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE)
    user_msg = models.TextField()
    ai_msg = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

