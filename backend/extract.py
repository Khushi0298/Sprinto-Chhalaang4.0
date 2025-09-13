import google.generativeai as genai

import requests
import datetime
import os
from dotenv import load_dotenv, find_dotenv

# Load the nearest .env (works even if you run from a subfolder)
load_dotenv(find_dotenv(), override=False)

# Read vars (with defaults / casting / required checks)
# owner = "vulnerable-apps"
# repo = "juice-shop"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
API_KEY = os.getenv("API_KEY")
owner = os.getenv("GITHUB_OWNER")
repo = os.getenv("GITHUB_REPO")

genai.configure(api_key=API_KEY)

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def ask_gemini(question, context):
    model = genai.GenerativeModel('gemini-pro')
    convo = model.start_chat()
    prompt = f"{question}\n\nHere is the repository info you can use:\n{context}"
    response = convo.send_message(prompt)
    return response.text

def fetch_repo_data(owner, repo):
    prs_url = f"https://api.github.com/repos/{owner}/{repo}/pulls?state=all&per_page=100"
    prs = requests.get(prs_url, headers=headers).json()

    # For review info, must get each PR's reviews separately
    for pr in prs:
        reviews_url = pr['url'] + "/reviews"
        pr['reviews'] = requests.get(reviews_url, headers=headers).json() if pr['state'] == "closed" else []
    return prs

def generate_context_text(prs, reference_reviewer="Alice"):
    now = datetime.datetime.utcnow()
    context_parts = []
    sep = "\n" + "-"*70 + "\n"

    # 1. PRs merged without approval
    merged_no_approval = []
    for pr in prs:
        if pr['merged_at']:
            # If there are no reviews or none with 'APPROVED'
            if not pr['reviews'] or not any(r['state'] == 'APPROVED' for r in pr['reviews']):
                merged_no_approval.append({
                    'id': pr['number'],
                    'title': pr['title'],
                    'merged_by': pr['merged_by']['login'] if pr.get('merged_by') else "Unknown",
                    'reviews': []
                })
    context_parts.append(
        f"PRs merged without approval: {len(merged_no_approval)}\n"
        + "PR ID | Title | Merged By | Reviews\n"
        + "\n".join([f"{pr['id']} | {pr['title']} | {pr['merged_by']} | {pr['reviews']}" for pr in merged_no_approval])
    )

    # 2. PRs reviewed by Alice
    alice_reviews = []
    for pr in prs:
        for rev in pr['reviews']:
            if rev['user']['login'].lower() == reference_reviewer.lower():
                alice_reviews.append({
                    'id': pr['number'],
                    'title': pr['title'],
                    'reviewer': rev['user']['login'],
                    'decision': rev['state'],
                    'date': rev['submitted_at']
                })
    context_parts.append(
        f"PRs reviewed by {reference_reviewer}:\n"
        + "PR ID | Title | Reviewer | Decision | Date\n"
        + "\n".join([f"{pr['id']} | {pr['title']} | {pr['reviewer']} | {pr['decision']} | {pr['date']}" for pr in alice_reviews])
    )

    # 3. PRs waiting for review >24h
    waiting_prs = []
    for pr in prs:
        if pr['state'] == 'open' and not pr.get('requested_reviewers'):  # No reviewers assigned
            created_at = datetime.datetime.strptime(pr['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            waiting_time = (now - created_at).total_seconds() / 3600
            if waiting_time > 24:
                waiting_prs.append({
                    'id': pr['number'],
                    'title': pr['title'],
                    'created_at': pr['created_at'],
                    'review_requested': False,
                    'waiting_hours': round(waiting_time, 1)
                })
    context_parts.append(
        f"PRs waiting >24h for review:\n"
        + "PR ID | Title | Created At | Review Requested | Waiting Hours\n"
        + "\n".join([f"{pr['id']} | {pr['title']} | {pr['created_at']} | {pr['review_requested']} | {pr['waiting_hours']}" for pr in waiting_prs])
    )

    # 4. PRs merged in last 7 days and who approved
    pr_last7 = []
    week_ago = now - datetime.timedelta(days=7)
    for pr in prs:
        if pr['merged_at']:
            merged_at = datetime.datetime.strptime(pr['merged_at'], "%Y-%m-%dT%H:%M:%SZ")
            if merged_at > week_ago:
                approvers = [rev['user']['login'] for rev in pr['reviews'] if rev['state'] == 'APPROVED']
                pr_last7.append({
                    'id': pr['number'],
                    'title': pr['title'],
                    'merged_at': pr['merged_at'],
                    'approvers': approvers
                })
    context_parts.append(
        "PRs merged in last 7 days:\n"
        + "PR ID | Title | Merged At | Approvers\n"
        + "\n".join([f"{pr['id']} | {pr['title']} | {pr['merged_at']} | {pr['approvers']}" for pr in pr_last7])
    )

    # Join all parts for use as LLM context
    return sep.join(context_parts)

# Example usage:
owner = "goSprinto"
repo = "dep-scan"
prs = fetch_repo_data(owner, repo)
context_text = generate_context_text(prs, reference_reviewer="Alice")
print(context_text[:])  # Show a portion for preview

# Example — assume you've gathered a file or branch summary as 'context_text'
question = "Which branches have no PRs yet?"
# print(ask_gemini(question, context_text))