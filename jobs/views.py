from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Company, Job
from .serializers import CompanySerializer, JobSerializer


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Job.objects.select_related("company").all()

        title = self.request.query_params.get("title")
        location = self.request.query_params.get("location")
        employment_type = self.request.query_params.get("employment_type")
        experience_level = self.request.query_params.get("experience_level")
        company = self.request.query_params.get("company")

        if title:
            queryset = queryset.filter(title__icontains=title)

        if location:
            queryset = queryset.filter(location__icontains=location)

        if employment_type:
            queryset = queryset.filter(
                employment_type=employment_type
            )

        if experience_level:
            queryset = queryset.filter(
                experience_level=experience_level
            )

        if company:
            queryset = queryset.filter(
                company__name__icontains=company
            )

        return queryset


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.select_related("company").all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]