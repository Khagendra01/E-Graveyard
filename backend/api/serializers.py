from rest_framework import serializers
from .models import CustomUser, Grave, GraveImages, ChatMessage, Messages, GraveVisitors

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'image']

class GraveSerializer(serializers.ModelSerializer):
    owner = CustomUserSerializer()

    class Meta:
        model = Grave
        fields = [
            'id', 'name', 'surname', 'other_Name', 'gender', 'is_alive',
            'content', 'dob', 'dod', 'voice_id', 'owner'
        ]

class GraveImagesSerializer(serializers.ModelSerializer):
    grave = GraveSerializer()
    owner = CustomUserSerializer()

    class Meta:
        model = GraveImages
        fields = ['id', 'grave', 'image', 'owner']

class GraveVisitorsSerializer(serializers.ModelSerializer):
    grave = GraveSerializer()
    visitor = CustomUserSerializer()

    class Meta:
        model = GraveVisitors
        fields = ['grave', 'visitor', 'message', 'gift']

class ChatMessageSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    grave = GraveSerializer()

    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'grave']

class MessagesSerializer(serializers.ModelSerializer):
    message = ChatMessageSerializer()

    class Meta:
        model = Messages
        fields = ['id', 'message', 'user_msg', 'ai_msg', 'timestamp']
        ordering = ['timestamp']
