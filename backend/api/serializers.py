from rest_framework import serializers
from .models import CustomUser, Grave, GraveImages, ChatMessage, Messages, GraveVisitors

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [ 'email', 'full_name', 'image']

class GraveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grave
        fields = [
            'id', 'name', 'surname', 'other_Name', 'gender', 'is_alive',
            'content', 'dob', 'dod', 'voice_id', 'owner'
        ]

class GraveImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraveImages
        fields = ['id', 'grave', 'image', 'owner']

class GraveVisitorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraveVisitors
        fields = ['grave', 'visitor', 'message', 'gift']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'grave']

class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ['id', 'message', 'user_msg', 'ai_msg', 'timestamp']
        ordering = ['timestamp']
