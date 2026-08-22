from django.urls import path
from .views import RegisterView, MyProfileView


urlpatterns = [
    path(
        "auth/register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "profile/",
        MyProfileView.as_view(),
        name="my-profile"
    ),
]