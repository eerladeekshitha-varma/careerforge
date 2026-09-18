from datetime import date

from rest_framework import serializers

from .models import Company, Job


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "website",
            "location",
            "industry",
            "description",
        ]


class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "company",
            "company_name",
            "title",
            "description",
            "location",
            "employment_type",
            "experience_level",
            "salary_min",
            "salary_max",
            "deadline",
            "required_skills",
            "posted_date",
        ]
        read_only_fields = [
            "posted_date",
            "company_name",
        ]

    def validate(self, attrs):
        salary_min = attrs.get("salary_min")
        salary_max = attrs.get("salary_max")
        deadline = attrs.get("deadline")

        if salary_min is not None and salary_max is not None:
            if salary_min > salary_max:
                raise serializers.ValidationError(
                    "Minimum salary cannot be greater than maximum salary."
                )

        if deadline is not None and deadline < date.today():
            raise serializers.ValidationError(
                "Job deadline cannot be in the past."
            )

        return attrs

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Job title cannot be empty."
            )

        return value.strip()