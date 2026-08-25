from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Interview
from .serializers import InterviewSerializer


class InterviewListCreateView(generics.ListCreateAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interview.objects.filter(
            application__user=self.request.user
        ).select_related(
            "application",
            "application__user",
            "application__job",
            "application__job__company",
        )

    def perform_create(self, serializer):
        application = serializer.validated_data["application"]

        if application.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You can only create interviews for your own applications."
            )

        serializer.save()


class InterviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interview.objects.filter(
            application__user=self.request.user
        ).select_related(
            "application",
            "application__user",
            "application__job",
            "application__job__company",
        )