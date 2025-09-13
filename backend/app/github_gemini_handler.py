# github_gemini_handler.py
import google.generativeai as genai
import requests
import datetime
import os
from dotenv import load_dotenv, find_dotenv
import pandas as pd
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

# def generate_context_text(prs, reference_reviewer="Alice"):
#     now = datetime.datetime.utcnow()
#     context_parts = []
#     sep = "\n" + "-" * 70 + "\n"

#     # (same logic you wrote before… unchanged)
#     # -------------------------------
#     merged_no_approval = []
#     for pr in prs:
#         if pr.get("merged_at"):
#             if not pr["reviews"] or not any(r["state"] == "APPROVED" for r in pr["reviews"]):
#                 merged_no_approval.append({
#                     "id": pr["number"],
#                     "title": pr["title"],
#                     "merged_by": pr["merged_by"]["login"] if pr.get("merged_by") else "Unknown",
#                     "reviews": []
#                 })
#     context_parts.append(
#         f"PRs merged without approval: {len(merged_no_approval)}\n"
#         + "PR ID | Title | Merged By | Reviews\n"
#         + "\n".join([f"{pr['id']} | {pr['title']} | {pr['merged_by']} | {pr['reviews']}" for pr in merged_no_approval])
#     )

#     # (keep other sections the same as your code)
#     # -------------------------------

#     return sep.join(context_parts)

def generate_full_context(owner, repo, reference_reviewer="Alice"):
    context_parts = []

    # Repo metadata
    repo_info = generate_repo_context(owner, repo)
    context_parts.append(f"Repository: {repo_info['name']} ({repo_info['owner']})\n"
                         f"Description: {repo_info['description']}\n"
                         f"Stars: {repo_info['stars']}, Forks: {repo_info['forks']}\n"
                         f"Default Branch: {repo_info['default_branch']}\n"
                         f"License: {repo_info['license']}")

    # Branches
    branches = generate_branch_context(owner, repo)
    context_parts.append("Branches:\n" + "\n".join([f"{b['name']} (commit: {b['commit'][:7]})" for b in branches]))

    # Issues
    issues = generate_issue_context(owner, repo)
    context_parts.append("Issues:\n" + "\n".join(
        [f"{i['id']} | {i['title']} | {i['state']} | Assignee: {i['assignee']} | Labels: {i['labels']}" for i in issues]
    ))

    # Pull Requests (reuse your existing generate_context_text)
    prs = fetch_repo_data(owner, repo)
    context_parts.append(generate_context_text(prs, reference_reviewer))

    return "\n\n" + ("-"*80 + "\n").join(context_parts)

def generate_repo_context(owner, repo):
    repo_url = f"https://api.github.com/repos/{owner}/{repo}"
    repo_data = requests.get(repo_url, headers=headers).json()
    return {
        "name": repo_data.get("name"),
        "owner": repo_data.get("owner", {}).get("login"),
        "description": repo_data.get("description"),
        "stars": repo_data.get("stargazers_count"),
        "forks": repo_data.get("forks_count"),
        "default_branch": repo_data.get("default_branch"),
        "license": repo_data.get("license", {}).get("spdx_id")
    }

def generate_branch_context(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/branches"
    branches = requests.get(url, headers=headers).json()
    return [{"name": b["name"], "protected": b["protected"], "commit": b["commit"]["sha"]} for b in branches]

def generate_issue_context(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/issues?state=all&per_page=100"
    issues = requests.get(url, headers=headers).json()
    issue_summary = []
    for i in issues:
        if "pull_request" not in i:  # exclude PRs
            issue_summary.append({
                "id": i["number"],
                "title": i["title"],
                "state": i["state"],
                "assignee": i["assignee"]["login"] if i.get("assignee") else None,
                "labels": [l["name"] for l in i["labels"]],
                "created_at": i["created_at"]
            })
    return issue_summary



def ask_gemini_with_csv(model, query, pr_info=None, csv_path=None):
    # Read CSV file if provided
    csv_text = ""
    if csv_path:
        df = pd.read_csv(csv_path)
        # Convert to readable text (Markdown table or raw CSV)
        csv_text = "CSV DATA:\n" + df.to_csv(index=False)

    # Combine all context parts
    context = ""
    if pr_info:
        context += "PR DATA:\n" + pr_info + "\n\n"
    if csv_text:
        context += csv_text + "\n\n"

    prompt = f"""
    You are a GitHub analysis assistant.

    Always follow this output format:
    *Description*: A concise summary (1 to 3 sentences)
    *Detailed Information*: A structured breakdown (tables, lists, or step-by-step).

    Rules:
    - Use only the provided PR DATA and CSV DATA to answer the question.
    - If some data is not relevant, silently ignore it (do NOT mention irrelevance).
    - Do not add disclaimers or commentary about missing or irrelevant data.


    Question:
    {query}

    Context:
    {context}
    """
    response = model.generate_content(prompt)
    return response.text
# print(response.text)
# query = "Which PRs are missing approvals and how many commits each has?"
# query = " please provide number of laptops available"
# query = "Show me all PRs raised"
csv_file = r"C:\Users\deepe\Downloads\eod_bot_project_full\backend\app\data.csv"
# print(context_text)
# response = ask_gemini_with_csv(model, query, pr_info=context_text, csv_path=csv_file)

# print(response)

def run_query(user_query: str):
    # prs = fetch_repo_data(owner, repo)
    context_text = generate_full_context(owner,repo)
    # print(context_text)
    response = model.generate_content(user_query + "\n\nPR DATA:\n" + context_text[:])
    # response = ask_gemini_with_csv(model, user_query, pr_info=context_text, csv_path=csv_file)
    return response.text
# print(run_query("How many PRs have been waiting for review for more than 24hrs?"))

# def run_query(user_query: str):
#     # query2 = "Which PRs are missing approvals and how many commits each has?"
#     modified_prompt = get_modified_prompt(user_query)
#     response = model.generate_content(modified_prompt)
#     return response.text

