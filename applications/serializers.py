from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company_name = serializers.CharField(
        source="job.company.name",
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "user",
            "username",
            "job",
            "job_title",
            "company_name",
            "status",
            "applied_date",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "username",
            "job_title",
            "company_name",
            "created_at",
            "updated_at",
        ]

    def validate_job(self, value):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            already_applied = Application.objects.filter(
                user=request.user,
                job=value
            ).exists()

            if already_applied:
                raise serializers.ValidationError(
                    "You have already applied to this job."
                )

        return value