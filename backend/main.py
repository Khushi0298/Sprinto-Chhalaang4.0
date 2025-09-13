# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your GitHub+Gemini logic
from app.github_gemini_handler import run_query # <-- rename your script to github_gemini_handler.py

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


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
