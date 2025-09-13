from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.auth import verify_token, create_access_token
from app.query_handler import handle_query

app = FastAPI()

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
async def login(username: str, password: str):
    if username == "auditor" and password == "password":
        token = create_access_token({"sub": username})
        return {"access_token": token}
    return {"error": "Invalid credentials"}

@app.post("/query")
async def query(query: str, user=Depends(verify_token)):
    return await handle_query(query)

@app.post("/upload")
async def upload(file: UploadFile = File(...), user=Depends(verify_token)):
    contents = await file.read()
    save_path = f"data/docs/{file.filename}"
    with open(save_path, "wb") as f:
        f.write(contents)
    return {"message": f"File {file.filename} uploaded successfully"}
