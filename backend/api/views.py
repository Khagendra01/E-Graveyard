from rest_framework import generics
from .models import LangchainPgEmbedding, ChatMessage, Grave, GraveImages, CustomUser, Messages, GraveVisitors
from .serializers import (CustomUserSerializer, ChatMessageSerializer, 
     GraveSerializer, GraveImagesSerializer, GraveVisitorsSerializer,
       MessagesSerializer)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .embedding import get_embedding
from langchain.text_splitter import CharacterTextSplitter
import uuid
from .chat import get_ai_response
from .voice_clone import voice_clone

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


class CustomTextSplitter:
    def __init__(self, chunk_size, chunk_overlap):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text):
        # Removing any additional newlines for splitting
        text = text.replace('\n\n', ' ')
        
        # List to hold the text chunks
        chunks = []
        
        # Split text into chunks based on chunk size and overlap
        start = 0
        while start < len(text):
            end = min(start + self.chunk_size, len(text))
            chunk = text[start:end]
            chunks.append(chunk)
            start += self.chunk_size - self.chunk_overlap
        
        return chunks
    

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
    
    def perform_create(self, serializer):

        grave = serializer.save() 
        grave_id = grave.id

        text = self.request.data.get('content', None)
        if text:
            custom_text_splitter = CustomTextSplitter(chunk_size=400, chunk_overlap=100)

            chunks = custom_text_splitter.split_text(text)
            for chunk in chunks:
                gen_embedding = get_embedding(chunk)
                LangchainPgEmbedding.objects.create(
                    uuid=uuid.uuid4(),
                    document=chunk,
                    embedding=gen_embedding,
                    custom_id=grave_id
                )
        
        return grave


class GraveDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grave.objects.all()
    serializer_class = GraveSerializer



# GraveImages Views
class GraveImagesListCreateView(generics.ListCreateAPIView):
    queryset = GraveImages.objects.all()
    serializer_class = GraveImagesSerializer
    #permission_classes = [IsAuthenticated]

    # def post(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data, many=True)
    #     if serializer.is_valid():
    #         self.perform_create(serializer)
    #         headers = self.get_success_headers(serializer.data)
    #         ############################ Celery Call here ##################################
    #         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
               


class ChatMessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    #permission_classes = [IsAuthenticated, IsChatOwner()]

class MessagesListCreateView(generics.ListCreateAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer
    #permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        instn = serializer.save()
        request = self.request
        msg_id = request.data.get('message')
        cmsg = ChatMessage.objects.get(id=msg_id)
        gid = cmsg.grave
        grave = Grave.objects.get(id=gid)
        full_name = grave.name + ' ' + grave.surname
        instn.ai_msg = get_ai_response(msg_id, request.data.get('user_msg'), full_name, gid)
        #instn.ai_msg = "I am bot"
        instn.save() 


class MessagesRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer
    #permission_classes = [IsAuthenticated]

class VoiceFilesView(APIView):
    def post(self, request):  
        voice_url = request.data.get('voice_url', None)
        voice_id = voice_clone(voice_url)

        return Response({'voice_id': voice_id}, status=status.HTTP_200_OK)
    
class GenerateAudioView(APIView):
    def get(self, request):
        grave_id = request.query_params.get('grave_id', None)
        if grave_id is None:
            return Response({'error': 'grave_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            record = Grave.objects.get(id=grave_id)
        except Grave.DoesNotExist:
            return Response({'error': 'Grave not found'}, status=status.HTTP_404_NOT_FOUND)
        
        voice_id = record.voice_id
        return Response({'voice_id': voice_id}, status=status.HTTP_200_OK)
