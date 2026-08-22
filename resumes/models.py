from django.db import models
from django.contrib.auth.models import User
from jobs.models import Job


class Resume(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    title = models.CharField(max_length=200)

    file = models.FileField(upload_to="resumes/")

    is_primary = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class ResumeAnalysis(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="analyses"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="resume_analyses"
    )

    match_score = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    matched_skills = models.JSONField(default=list)

    missing_skills = models.JSONField(default=list)

    recommendations = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.resume.title} → "
            f"{self.job.title} ({self.match_score}%)"
        )