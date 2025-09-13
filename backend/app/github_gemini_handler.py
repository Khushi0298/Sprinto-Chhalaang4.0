# github_gemini_handler.py
import google.generativeai as genai
import requests
import datetime
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=False)

model = genai.GenerativeModel("gemini-1.5-flash")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GEMINI_API = os.getenv("GEMINI_API")
owner = os.getenv("GITHUB_OWNER", "vulnerable-apps")
repo = os.getenv("GITHUB_REPO", "juice-shop")

genai.configure(api_key=GEMINI_API)

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}


def fetch_repo_data(owner, repo):
    prs_url = f"https://api.github.com/repos/{owner}/{repo}/pulls?state=all&per_page=100"
    prs = requests.get(prs_url, headers=headers).json()

    for pr in prs:
        if "url" in pr:  # Avoid errors on malformed data
            reviews_url = pr["url"] + "/reviews"
            pr["reviews"] = requests.get(reviews_url, headers=headers).json() if pr["state"] == "closed" else []
    return prs


def generate_context_text(prs, reference_reviewer="Alice"):
    now = datetime.datetime.utcnow()
    context_parts = []
    sep = "\n" + "-" * 70 + "\n"

    # (same logic you wrote before… unchanged)
    # -------------------------------
    merged_no_approval = []
    for pr in prs:
        if pr.get("merged_at"):
            if not pr["reviews"] or not any(r["state"] == "APPROVED" for r in pr["reviews"]):
                merged_no_approval.append({
                    "id": pr["number"],
                    "title": pr["title"],
                    "merged_by": pr["merged_by"]["login"] if pr.get("merged_by") else "Unknown",
                    "reviews": []
                })
    context_parts.append(
        f"PRs merged without approval: {len(merged_no_approval)}\n"
        + "PR ID | Title | Merged By | Reviews\n"
        + "\n".join([f"{pr['id']} | {pr['title']} | {pr['merged_by']} | {pr['reviews']}" for pr in merged_no_approval])
    )

    # (keep other sections the same as your code)
    # -------------------------------

    return sep.join(context_parts)


def run_query(user_query: str):
    prs = fetch_repo_data(owner, repo)
    context_text = generate_context_text(prs, reference_reviewer="Alice")

    response = model.generate_content(user_query + "\n\nPR DATA:\n" + context_text)
    return response.text
