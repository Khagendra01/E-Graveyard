from rest_framework import generics
from .models import ChatMessage, Grave, GraveImages, CustomUser, Messages, GraveVisitors
from .serializers import (CustomUserSerializer, ChatMessageSerializer, 
     GraveSerializer, GraveImagesSerializer, GraveVisitorsSerializer,
       MessagesSerializer)
from .permissions import IsGraveOwner, IsOwner
from rest_framework.response import Response
from rest_framework import status
from .tasks import test
from rest_framework.views import APIView


class CustomUserListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        email = self.request.query_params.get('email', None)
        if email:
            return CustomUser.objects.filter(email=email)
        return CustomUser.objects.all()

    def post(self, request, *args, **kwargs):
        email = request.data.get('email', None)
        if email:
            existing_user = CustomUser.objects.filter(email=email).first()
            if existing_user:
                serializer = self.get_serializer(existing_user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return super().post(request, *args, **kwargs)

class CustomUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    #permission_classes = [IsOwner]

# Grave Views
class GraveListCreateView(generics.ListCreateAPIView):
    queryset = Grave.objects.all()
    serializer_class = GraveSerializer
    def get_queryset(self):
        queryset = Grave.objects.all()
        email = self.request.query_params.get('owner', None)
        if email is not None:
            queryset = queryset.filter(owner=email)
        return queryset


class GraveDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grave.objects.all()
    serializer_class = GraveSerializer



# GraveImages Views
class GraveImagesListCreateView(generics.ListCreateAPIView):
    queryset = GraveImages.objects.all()
    serializer_class = GraveImagesSerializer
    #permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            ############################ Celery Call here ##################################
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # process the AI function to process the image to generate the embedding of the image description

class GraveImagesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GraveImages.objects.all()
    serializer_class = GraveImagesSerializer

    # def get_permissions(self):
    #     if self.request.method == 'GET':
    #         return []
    #     else:
    #         return [IsAuthenticated(), IsGraveOwner()]
        
#gravevisitor Views
class GraveVisitorsListCreateView(generics.ListCreateAPIView):
    queryset = GraveVisitors.objects.all()
    serializer_class = GraveVisitorsSerializer
    #permission_classes = [IsAuthenticated]

class GraveVisitorsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GraveVisitors.objects.all()
    serializer_class = GraveVisitorsSerializer
    #permission_classes = [IsAuthenticated]
    
        
# ChatMessage Views
class ChatMessageListCreateView(generics.ListCreateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    #permission_classes = [IsAuthenticated]


class ChatMessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    #permission_classes = [IsAuthenticated, IsChatOwner()]

class MessagesListCreateView(generics.ListCreateAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer
    #permission_classes = [IsAuthenticated]

class MessagesRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer
    #permission_classes = [IsAuthenticated]

class MyAPIView(APIView):
    def get(self, request):
        data = {'message': 'Hello, APIView!'}
        #test.delay()
        return Response(data, status=status.HTTP_200_OK)
