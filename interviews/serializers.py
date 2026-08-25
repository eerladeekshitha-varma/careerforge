from rest_framework import serializers

from .models import Interview


class InterviewSerializer(serializers.ModelSerializer):
    application_username = serializers.CharField(
        source="application.user.username",
        read_only=True
    )

    job_title = serializers.CharField(
        source="application.job.title",
        read_only=True
    )

    company_name = serializers.CharField(
        source="application.job.company.name",
        read_only=True
    )

    class Meta:
        model = Interview
        fields = [
            "id",
            "application",
            "application_username",
            "job_title",
            "company_name",
            "round_name",
            "scheduled_at",
            "mode",
            "status",
            "interviewer",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "application_username",
            "job_title",
            "company_name",
            "created_at",
            "updated_at",
        ]