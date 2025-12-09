from django.urls import path
from .views import RegisterView, LoginView, LogoutView
from .views import ConversationListView, MessageListView, MessageCreateView
from .views import ConversationCreateView, FindUserByEmailView


urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),

    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path("conversations/create/", ConversationCreateView.as_view(), name="conversation-create"),
    path("users/find/", FindUserByEmailView.as_view()),
    path("conversations/<uuid:conversation_id>/messages/", MessageListView.as_view(), name="message-list"),
    path("messages/send/", MessageCreateView.as_view(), name="message-send"),


]
