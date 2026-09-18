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

    def validate_status(self, value):
        if self.instance is None:
            allowed_initial_statuses = [
                Application.Status.SAVED,
                Application.Status.APPLIED,
            ]

            if value not in allowed_initial_statuses:
                raise serializers.ValidationError(
                    "A new application can only have SAVED or APPLIED status."
                )

            return value

        current_status = self.instance.status

        allowed_transitions = {
            Application.Status.SAVED: [
                Application.Status.APPLIED,
            ],
            Application.Status.APPLIED: [
                Application.Status.ASSESSMENT,
                Application.Status.REJECTED,
            ],
            Application.Status.ASSESSMENT: [
                Application.Status.INTERVIEW,
                Application.Status.REJECTED,
            ],
            Application.Status.INTERVIEW: [
                Application.Status.SELECTED,
                Application.Status.REJECTED,
            ],
            Application.Status.SELECTED: [],
            Application.Status.REJECTED: [],
        }

        if (
            value != current_status
            and value not in allowed_transitions[current_status]
        ):
            raise serializers.ValidationError(
                f"Invalid status transition from "
                f"{current_status} to {value}."
            )

        return value