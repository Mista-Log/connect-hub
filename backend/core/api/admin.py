from django.contrib import admin
from .models import User, UnreadMessage, Message, Conversation

# Register your models here.
admin.site.register(User)
admin.site.register(UnreadMessage)
admin.site.register(Message)
admin.site.register(Conversation)