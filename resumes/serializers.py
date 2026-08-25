from rest_framework import serializers

from .models import Resume, ResumeAnalysis


class ResumeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = Resume
        fields = [
            "id",
            "user",
            "username",
            "title",
            "file",
            "is_primary",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "user",
            "username",
            "created_at",
            "updated_at",
        ]


class ResumeAnalysisSerializer(serializers.ModelSerializer):
    resume_title = serializers.CharField(
        source="resume.title",
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
        model = ResumeAnalysis
        fields = [
            "id",
            "resume",
            "resume_title",
            "job",
            "job_title",
            "company_name",
            "match_score",
            "matched_skills",
            "missing_skills",
            "recommendations",
            "created_at",
        ]

        read_only_fields = [
            "resume_title",
            "job_title",
            "company_name",
            "match_score",
            "matched_skills",
            "missing_skills",
            "recommendations",
            "created_at",
        ]