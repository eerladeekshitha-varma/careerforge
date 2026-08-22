from django.db import models
from applications.models import Application


class Interview(models.Model):

    class InterviewMode(models.TextChoices):
        ONLINE = "ONLINE", "Online"
        IN_PERSON = "IN_PERSON", "In Person"
        PHONE = "PHONE", "Phone"

    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"
        RESCHEDULED = "RESCHEDULED", "Rescheduled"

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="interviews"
    )

    round_name = models.CharField(max_length=100)

    scheduled_at = models.DateTimeField()

    mode = models.CharField(
        max_length=20,
        choices=InterviewMode.choices,
        default=InterviewMode.ONLINE
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED
    )

    interviewer = models.CharField(
        max_length=200,
        blank=True
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.round_name} - {self.application}"