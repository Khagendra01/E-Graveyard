from django.db import models
from pgvector.django import VectorField

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
    image = models.CharField(max_length=255, blank=True, null=True)
    owner = models.EmailField()

class GraveImages(models.Model):
    grave = models.IntegerField()
    image = models.CharField(max_length=255)
    owner = models.EmailField()

class GraveVisitors(models.Model):
    grave = models.IntegerField()
    visitor = models.EmailField()
    message = models.TextField()
    gift = models.URLField(max_length=255, blank=True, null=True)

class ChatMessage(models.Model):
    user = models.EmailField(blank=False, null=False)
    grave = models.IntegerField(blank=False, null=False)
    voice_id = models.CharField(max_length=255, blank=True, null=True)
    
class Messages(models.Model):
    message = models.IntegerField(blank=False, null=False)
    user_msg = models.TextField()
    ai_msg = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

class LangchainPgCollection(models.Model):
    name = models.CharField(blank=True, null=True)
    cmetadata = models.TextField(blank=True, null=True)  # This field type is a guess.
    uuid = models.UUIDField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'langchain_pg_collection'


class LangchainPgEmbedding(models.Model):
    uuid = models.UUIDField(primary_key=True)
    collection = models.ForeignKey(LangchainPgCollection, models.DO_NOTHING, blank=True, null=True)
    embedding = VectorField(dimensions=1536) 
    document = models.CharField(blank=True, null=True)
    cmetadata = models.TextField(blank=True, null=True) 
    custom_id = models.CharField(blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'langchain_pg_embedding'

