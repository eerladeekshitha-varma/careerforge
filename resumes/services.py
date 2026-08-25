from .models import ResumeAnalysis


def analyze_resume(resume, job, resume_skills):
    """
    Compare resume skills against skills mentioned
    in the job description.
    """

    normalized_resume_skills = {
        skill.strip().lower()
        for skill in resume_skills
        if skill.strip()
    }

    job_text = f"{job.title} {job.description}".lower()

    matched_skills = []
    missing_skills = []

    for skill in normalized_resume_skills:
        if skill in job_text:
            matched_skills.append(skill)

    # For the first version, use the skills supplied
    # by the user as the comparison baseline.
    #
    # We will improve job-skill extraction later.

    if normalized_resume_skills:
        match_score = (
            len(matched_skills)
            / len(normalized_resume_skills)
        ) * 100
    else:
        match_score = 0

    if match_score < 50:
        recommendations = [
            "Add more skills relevant to the target job.",
            "Highlight projects demonstrating the required technologies.",
            "Improve your resume with measurable project achievements.",
        ]
    elif match_score < 80:
        recommendations = [
            "Strengthen the skills that appear in the job description.",
            "Highlight relevant projects and practical experience.",
        ]
    else:
        recommendations = [
            "Your skill alignment is strong.",
            "Highlight your strongest matching projects and achievements.",
        ]

    return {
        "match_score": round(match_score, 2),
        "matched_skills": sorted(matched_skills),
        "missing_skills": sorted(missing_skills),
        "recommendations": recommendations,
    }