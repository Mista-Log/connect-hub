from django.shortcuts import render

# Create your views here.
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


# List messages in a conversation
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv_id = self.kwargs["conversation_id"]
        return Message.objects.filter(conversation__id=conv_id).order_by("created_at")


# Send a message
class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        conversation = Conversation.objects.get(id=self.request.data["conversation"])
        message = serializer.save(sender=self.request.user, conversation=conversation)
        # Update last message in conversation
        conversation.last_message = message
        conversation.save()
        # Create unread messages for other members
        for member in conversation.members.exclude(id=self.request.user.id):
            UnreadMessage.objects.create(user=member, message=message)


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
