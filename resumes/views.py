from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

from .models import Resume, ResumeAnalysis
from .serializers import ResumeSerializer, ResumeAnalysisSerializer
from .services import analyze_resume


class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(
            user=self.request.user
        )


class ResumeAnalysisListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeAnalysisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ResumeAnalysis.objects.filter(
            resume__user=self.request.user
        )

    def perform_create(self, serializer):
        resume = serializer.validated_data["resume"]
        job = serializer.validated_data["job"]

        if resume.user != self.request.user:
            raise serializers.ValidationError(
                {"resume": "You can only analyze your own resume."}
            )

        analysis = analyze_resume(resume, job)

        serializer.instance = analysis


class ResumeAnalysisDetailView(generics.RetrieveAPIView):
    serializer_class = ResumeAnalysisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ResumeAnalysis.objects.filter(
            resume__user=self.request.user
        )