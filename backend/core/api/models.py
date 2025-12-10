import uuid
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.conf import settings

# User = settings.AUTH_USER_MODEL


class UserManager(BaseUserManager):
    """Custom manager for User model using email instead of username."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must provide an email address.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for the messaging application.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)

    profile_picture = models.ImageField(
        upload_to='profile_images/', blank=True, null=True
    )

    # Messaging related fields
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(blank=True, null=True)

    # Permissions
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Timestamps
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email

    @property
    def name(self):
        return self.full_name


class Conversation(models.Model):
    """
    A chat room — supports both 1-on-1 and group chats.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True, null=True)  # For group chats
    is_group = models.BooleanField(default=False)
    members = models.ManyToManyField(User, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)
    last_message = models.ForeignKey(
        "Message",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="last_message_of"
    )

    def __str__(self):
        return self.name or f"Conversation {self.id}"


class Message(models.Model):
    MESSAGE_TYPES = (
        ("text", "Text"),
        ("image", "Image"),
        ("file", "File"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    content = models.TextField()  # Works for text OR file/image URL

    type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default="text")

    created_at = models.DateTimeField(auto_now_add=True)
    is_edited = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.full_name}: {self.content[:30]}"



class UnreadMessage(models.Model):
    """
    Tracks unread messages for each user.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="unread_messages")
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name="unread_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "message")

    def __str__(self):
        return f"{self.user.full_name} has not read {self.message.id}"
