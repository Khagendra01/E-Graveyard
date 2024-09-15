from django.urls import path
from .views import (
    ChatMessageListCreateView, ChatMessageDetailView,
    GraveListCreateView, GraveDetailView,
    GraveImagesListCreateView, GraveImagesDetailView,
    CustomUserListCreateView, CustomUserRetrieveUpdateDestroyView,
    GraveVisitorsListCreateView, GraveVisitorsDetailView,
    MessagesListCreateView, MessagesRetrieveUpdateDestroyView,
    VoiceFilesView, GenerateAudioView
)

urlpatterns = [
    # User URLs
    path('add-user/', CustomUserListCreateView.as_view(), name='customuser-list-create'),
    path('user/<str:pk>/', CustomUserRetrieveUpdateDestroyView.as_view(), name='customuser-detail'),

    # ChatMessage URLs
    path('chat-messages/', ChatMessageListCreateView.as_view(), name='chatmessage-list-create'),
    path('chat-messages/<int:pk>/', ChatMessageDetailView.as_view(), name='chatmessage-detail'),

    # Message URLs
    path('messages/', MessagesListCreateView.as_view(), name='message-list-create'),
    path('messages/<int:pk>/', ChatMessageDetailView.as_view(), name='message-detail'),

    # Grave URLs
    path('graves/', GraveListCreateView.as_view(), name='grave-list-create'),
    path('graves/<int:pk>/', GraveDetailView.as_view(), name='grave-detail'),

    # GraveImages URLs
    path('grave-images/', GraveImagesListCreateView.as_view(), name='graveimages-list-create'),
    path('grave-images/<int:pk>/', GraveImagesDetailView.as_view(), name='graveimages-detail'),

    path('audio-files/', VoiceFilesView.as_view(), name='audio-files'),
    path('get-voice/', GenerateAudioView.as_view(), name='get-voice'),

    # grave-visitor URLs
    path('grave-visitors/', GraveVisitorsListCreateView.as_view(), name='gravevisitors-list-create'),
    path('grave-visitors/<int:pk>/', GraveVisitorsDetailView.as_view(), name='gravevisitors-detail'),

    # Test URL
]
