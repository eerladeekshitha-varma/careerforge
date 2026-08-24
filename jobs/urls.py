from django.urls import path

from .views import (
    CompanyListCreateView,
    CompanyDetailView,
    JobListCreateView,
    JobDetailView,
)


urlpatterns = [
    path(
        "companies/",
        CompanyListCreateView.as_view(),
        name="company-list-create",
    ),
    path(
        "companies/<int:pk>/",
        CompanyDetailView.as_view(),
        name="company-detail",
    ),
    path(
        "jobs/",
        JobListCreateView.as_view(),
        name="job-list-create",
    ),
    path(
        "jobs/<int:pk>/",
        JobDetailView.as_view(),
        name="job-detail",
    ),
]
