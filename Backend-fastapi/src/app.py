#app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from query import generate_answer, log_chat
from retreival import retrieve, SUBJECTS

app = FastAPI()

# allow your React frontend (or Express) to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # tighten this to your backend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str
    subject_choice: str  # "1", "2", "3", "4" subject key
class ChatResponse(BaseModel):
    answer: str
    subject: str
    num_chunks: int


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if req.subject_choice not in SUBJECTS:
        raise HTTPException(status_code=400, detail="Invalid subject choice")

    subject = SUBJECTS[req.subject_choice]
    chunks = retrieve(req.question, subject["path"], subject["topics"])

    if not chunks:
        answer = "I couldn't find anything relevant in the textbook for that."
    else:
        answer = generate_answer(req.question, chunks)

    log_chat(subject["name"], req.question, len(chunks), answer)

    return ChatResponse(answer=answer, subject=subject["name"], num_chunks=len(chunks))