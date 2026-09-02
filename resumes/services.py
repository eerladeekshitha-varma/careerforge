from docx import Document

from .models import ResumeAnalysis


# Skills we currently support in CareerForge.
# The key is the canonical Skill name used in the database.
SKILL_ALIASES = {
    "python": ["python"],
    "django": ["django"],
    "react": ["react"],
    "git": ["git"],
    "rest api": [
        "rest api",
        "restful api",
        "rest apis",
        "restful apis",
    ],
    "javascript": ["javascript"],
    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "sql": ["sql"],
    "postgresql": ["postgresql", "postgres"],
    "mongodb": ["mongodb"],
    "fastapi": ["fastapi"],
    "github": ["github"],
    "postman": ["postman"],
    "streamlit": ["streamlit"],
    "supabase": ["supabase"],
}


def extract_resume_text(resume):
    """
    Extract text from a DOCX resume.
    """

    document = Document(resume.file.path)

    paragraphs = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs)


def extract_resume_skills(resume):
    """
    Detect known skills from the extracted resume text.
    """

    text = extract_resume_text(resume).lower()

    detected_skills = set()

    for skill, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            if alias in text:
                detected_skills.add(skill)
                break

    return detected_skills


def analyze_resume(resume, job):
    """
    Analyze a resume against a job and create a ResumeAnalysis record.
    """

    required_skills = {
        skill.lower()
        for skill in job.required_skills.values_list("name", flat=True)
    }

    resume_skills = extract_resume_skills(resume)

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