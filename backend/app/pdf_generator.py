import matplotlib.pyplot as plt
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
import tempfile
import os

def generate_pdf_from_response(data, repo_stats=None, issues=None, prs=None):
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    doc = SimpleDocTemplate(tmp_file.name, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph("Evidence-on-Demand Bot Report", styles["Title"]))
    story.append(Spacer(1, 12))

    # Query and AI response
    story.append(Paragraph(f"<b>Query:</b> {data['query']}", styles["Normal"]))
    story.append(Paragraph(f"<b>Response:</b> {data['response']}", styles["Normal"]))
    story.append(Spacer(1, 12))

    if repo_stats:
        story.append(Paragraph("<b>Repository Metadata</b>", styles["Heading2"]))
        story.append(Paragraph(f"Repo: {repo_stats.get('name')} ({repo_stats.get('owner')})", styles["Normal"]))
        story.append(Paragraph(f"Description: {repo_stats.get('description')}", styles["Normal"]))
        story.append(Paragraph(f"Stars: {repo_stats.get('stars')}, Forks: {repo_stats.get('forks')}", styles["Normal"]))
        story.append(Spacer(1, 12))


    if prs:
        status_counts = {"merged": 0, "open": 0, "closed": 0}
        for pr in prs:
            if pr.get("merged_at"):
                status_counts["merged"] += 1
            elif pr["state"] == "open":
                status_counts["open"] += 1
            else:
                status_counts["closed"] += 1

        plt.figure(figsize=(4,4))
        plt.pie(status_counts.values(), labels=status_counts.keys(), autopct='%1.1f%%')
        plt.title("Pull Request Status Distribution")
        chart_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        plt.savefig(chart_file.name)
        plt.close()
        story.append(Image(chart_file.name, width=300, height=300))
        story.append(Spacer(1, 12))

    # 📊 Graph 2: Issues over time
    if issues:
        dates = [i["created_at"][:10] for i in issues]
        states = [i["state"] for i in issues]
        open_count = sum(1 for s in states if s == "open")
        closed_count = sum(1 for s in states if s == "closed")

        plt.figure(figsize=(5,3))
        plt.bar(["Open Issues", "Closed Issues"], [open_count, closed_count], color=["orange", "green"])
        plt.title("Issues Overview")
        chart_file2 = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        plt.savefig(chart_file2.name)
        plt.close()
        story.append(Image(chart_file2.name, width=300, height=200))
        story.append(Spacer(1, 12))

    # 📊 Table: Issues summary
    if issues:
        story.append(Paragraph("<b>Issues Summary</b>", styles["Heading2"]))
        table_data = [["ID", "Title", "State", "Assignee", "Labels"]]
        for i in issues[:5]:  # show top 5
            table_data.append([
                i["id"],
                i["title"][:40],
                i["state"],
                i["assignee"] or "-",
                ", ".join(i["labels"]) if i["labels"] else "-"
            ])
        story.append(Table(table_data))
        story.append(Spacer(1, 12))

    doc.build(story)
    return tmp_file.name
