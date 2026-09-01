from .models import ResumeAnalysis


def analyze_resume(resume, job):
    """
    Analyze a resume against a job and create a ResumeAnalysis record.
    """

    # Temporary skill matching logic.
    # We will improve this later with actual resume text extraction / AI.

    required_skills = set(
        job.required_skills.values_list("name", flat=True)
    )

    # For now, use an empty set because we haven't implemented
    # resume skill extraction yet.
    resume_skills = set()

    matched_skills = sorted(
        required_skills.intersection(resume_skills)
    )

    missing_skills = sorted(
        required_skills.difference(resume_skills)
    )

    if required_skills:
        match_score = (
            len(matched_skills) / len(required_skills)
        ) * 100
    else:
        match_score = 0

    recommendations = []

    if missing_skills:
        recommendations.append(
            "Consider adding or improving the missing skills."
        )

    if not required_skills:
        recommendations.append(
            "This job does not have any required skills listed yet."
        )

    return ResumeAnalysis.objects.create(
        resume=resume,
        job=job,
        match_score=round(match_score, 2),
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        recommendations=recommendations,
    )