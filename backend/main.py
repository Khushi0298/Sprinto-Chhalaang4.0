# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.pdf_generator import generate_pdf_from_response
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Import your GitHub+Gemini logic
from app.github_gemini_handler import run_query, generate_repo_context, generate_issue_context, fetch_repo_data # <-- rename your script to github_gemini_handler.py

app = FastAPI()

# Allow frontend (React/Postman) calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to ["http://localhost:5173"] for frontend only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query_api(request: Request):
    body = await request.json()
    user_query = body.get("query")
    if not user_query:
        return {"error": "Query is required"}
    
    # Call your logic
    result = run_query(user_query)
    return {"query": user_query, "response": result}

class QueryRequest(BaseModel):
    query: str

@app.post("/query-pdf")
async def query_and_get_pdf(request: QueryRequest):
    response_text = run_query(request.query)

    # Repo metadata + issues + PRs
    repo_stats = generate_repo_context("vulnerable-apps", "juice-shop")
    issues = generate_issue_context("vulnerable-apps", "juice-shop")
    prs = fetch_repo_data("vulnerable-apps", "juice-shop")

    response_data = {
        "query": request.query,
        "response": response_text
    }

    pdf_file = generate_pdf_from_response(response_data, repo_stats, issues, prs)
    return FileResponse(pdf_file, media_type="application/pdf", filename="audit_report.pdf")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
