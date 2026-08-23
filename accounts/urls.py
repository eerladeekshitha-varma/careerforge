from django.urls import path
from .views import (
    RegisterView,
    MyProfileView,
    SkillListCreateView,
    SkillDeleteView,
)


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

    path(
        "skills/",
        SkillListCreateView.as_view(),
        name="skills"
    ),

    path(
    "skills/<int:pk>/",
    SkillDeleteView.as_view(),
    name="skill-delete"
),

]