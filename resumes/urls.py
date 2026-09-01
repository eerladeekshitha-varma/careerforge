from django.urls import path

from .views import (
    ResumeListCreateView,
    ResumeDetailView,
    ResumeAnalysisListCreateView,
)


urlpatterns = [
    path(
        "resumes/",
        ResumeListCreateView.as_view(),
        name="resume-list-create",
    ),
    path(
        "resumes/<int:pk>/",
        ResumeDetailView.as_view(),
        name="resume-detail",
    ),
    path(
        "resume-analysis/",
        ResumeAnalysisListCreateView.as_view(),
        name="resume-analysis-list-create",
    ),
]