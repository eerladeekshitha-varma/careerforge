from django.db.migrations import serializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Profile, Skill
from .serializers import ProfileSerializer, RegisterSerializer, SkillSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class SkillListCreateView(generics.ListCreateAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.skills.all()

    def perform_create(self, serializer):
        skill_name = serializer.validated_data["name"]

        skill, created = Skill.objects.get_or_create(
            name=skill_name
        )

        self.request.user.profile.skills.add(skill)



class SkillDeleteView(generics.DestroyAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.skills.all()

    def perform_destroy(self, instance):
        self.request.user.profile.skills.remove(instance)