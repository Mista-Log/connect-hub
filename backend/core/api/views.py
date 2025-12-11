from django.shortcuts import render

# Create your views here.
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import LogoutSerializer
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework import generics, permissions
from .models import Conversation, Message, UnreadMessage, User
from .serializers import ConversationSerializer, MessageSerializer, UserSerializer, ConversationCreateSerializer
from .serializers import CreateMessageSerializer
from rest_framework.generics import UpdateAPIView

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully.",
                    "user": {
                        "id": str(user.id),
                        "full_name": user.full_name,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful.",
                    "user": {
                        "id": str(user.id),
                        "full_name": user.full_name,
                        "email": user.email,
                    },
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserProfileView(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# List all conversations for the logged-in user
class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all().order_by("-last_message__created_at")

class ConversationCreateView(generics.CreateAPIView):
    serializer_class = ConversationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Ensure the current user is added automatically
        conversation = serializer.save()
        if self.request.user not in conversation.members.all():
            conversation.members.add(self.request.user)
            conversation.save()


class FetchMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        user = request.user

        # Check if conversation exists
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response(
                {"error": "Conversation does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if user is part of the conversation
        if not conversation.members.filter(id=user.id).exists():
            return Response(
                {"error": "You are not a member of this conversation."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Fetch messages
        messages = Message.objects.filter(
            conversation=conversation
        ).order_by("created_at")  # oldest first

        serializer = MessageSerializer(messages, many=True)

        return Response({
            "conversation": str(conversation.id),
            "messages": serializer.data
        }, status=status.HTTP_200_OK)




# class CreateMessageView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = CreateMessageSerializer(
#             data=request.data,
#             context={"request": request}
#         )

#         if serializer.is_valid():
#             message = serializer.save()

#             return Response({
#                 "message": "Message sent successfully.",
#                 "data": {
#                     "id": str(message.id),
#                     "conversation": str(message.conversation.id),
#                     "sender": message.sender.full_name,
#                     "content": message.content,
#                     "type": message.type,
#                     "created_at": message.created_at,
#                 }
#             }, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateMessageSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            message = serializer.save()

            return Response({
                "message": "Message sent successfully.",
                "data": {
                    "id": str(message.id),
                    "conversation": str(message.conversation.id),
                    "sender_id": message.sender.id,
                    "content": message.content,
                    "type": message.type,
                    "timestamp": message.created_at,

                    # required for frontend
                    "file_url": settings.MEDIA_URL + message.content if message.type != "text" else None,
                    "file_name": message.content.split("/")[-1] if message.type != "text" else None,
                    "file_size": request.FILES.get("file").size if request.FILES.get("file") else None,
                }
            }, status=status.HTTP_201_CREATED)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class FindUserByEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.query_params.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
            return Response({
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name
            })
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
