from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Application
from .serializers import ApplicationSerializer


class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            user=self.request.user
        ).select_related(
            "job",
            "job__company"
        )

    def perform_create(self, serializer):
        status = serializer.validated_data.get(
            "status",
            Application.Status.SAVED
        )

        applied_date = None

        if status == Application.Status.APPLIED:
            applied_date = timezone.now()

        serializer.save(
            user=self.request.user,
            applied_date=applied_date
        )


class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            user=self.request.user
        ).select_related(
            "job",
            "job__company"
        )
