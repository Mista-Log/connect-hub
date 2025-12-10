from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import User, Conversation, Message, UnreadMessage

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["full_name", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError(
                "Email and password are required."
            )

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        data["user"] = user
        return data

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs.get("refresh")
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            raise serializers.ValidationError("Invalid or expired token.")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email"]


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name", read_only=True)
    sender_id = serializers.CharField(source="sender.id", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "conversation",
            "sender_id",
            "sender_name",
            "content",
            "type",
            "created_at",
            "is_edited",
        ]


class CreateMessageSerializer(serializers.ModelSerializer):
    conversation = serializers.UUIDField()
    content = serializers.CharField()
    type = serializers.ChoiceField(choices=["text", "image", "file"])

    class Meta:
        model = Message
        fields = ["conversation", "content", "type"]

    def validate_conversation(self, conversation_id):
        try:
            return Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            raise serializers.ValidationError("Conversation does not exist.")

    def create(self, validated_data):
        conversation = validated_data.pop("conversation")
        user = self.context["request"].user

        message = Message.objects.create(
            conversation=conversation,
            sender=user,
            **validated_data
        )

        # update last message
        conversation.last_message = message
        conversation.save()

        return message



class ConversationCreateSerializer(serializers.ModelSerializer):
    # Accept member IDs for creation
    member_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True
    )

    class Meta:
        model = Conversation
        fields = ["id", "name", "is_group", "member_ids"]

    def create(self, validated_data):
        member_ids = validated_data.pop("member_ids", [])
        conversation = Conversation.objects.create(**validated_data)

        # Add members
        members = User.objects.filter(id__in=member_ids)
        conversation.members.set(members)
        conversation.save()
        return conversation


class ConversationSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    last_message = MessageSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "name", "is_group", "members", "last_message", "created_at"]


class UnreadMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    message = MessageSerializer(read_only=True)

    class Meta:
        model = UnreadMessage
        fields = ["id", "user", "message", "created_at"]