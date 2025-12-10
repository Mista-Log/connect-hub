from django.urls import path
from .views import RegisterView, LoginView, LogoutView
from .views import ConversationListView, FetchMessagesView
from .views import ConversationCreateView, FindUserByEmailView, CreateMessageView


urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),

    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path("conversations/create/", ConversationCreateView.as_view(), name="conversation-create"),
    path("users/find/", FindUserByEmailView.as_view()),
    path("messages/<uuid:conversation_id>/", FetchMessagesView.as_view(), name="message-list"),
    path("messages/create/", CreateMessageView.as_view(), name="message-send"),


]
