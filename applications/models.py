from django.db import models
from django.contrib.auth.models import User
from jobs.models import Job


class Application(models.Model):

    class Status(models.TextChoices):
        SAVED = "SAVED", "Saved"
        APPLIED = "APPLIED", "Applied"
        ASSESSMENT = "ASSESSMENT", "Assessment"
        INTERVIEW = "INTERVIEW", "Interview"
        SELECTED = "SELECTED", "Selected"
        REJECTED = "REJECTED", "Rejected"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SAVED
    )

    applied_date = models.DateTimeField(
        null=True,
        blank=True
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.job.title}"