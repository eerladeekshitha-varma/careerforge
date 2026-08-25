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