# import warnings
# warnings.filterwarnings("ignore")

# import os
# import re
# import csv
# from datetime import datetime
# import anthropic
# from dotenv import load_dotenv
# from retreival import retrieve, SUBJECTS

# load_dotenv()
# client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# MODEL_NAME = "claude-haiku-4-5"
# LOG_FILE = "chat_log.csv"


# def log_chat(subject_name, question, num_chunks, answer, mode="theory"):
#     """Append one Q&A turn to a CSV log file."""
#     file_exists = os.path.isfile(LOG_FILE)

#     with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
#         writer = csv.writer(f)
#         if not file_exists:
#             writer.writerow(["timestamp", "subject", "mode", "question", "num_chunks", "answer"])

#         writer.writerow([
#             datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#             subject_name,
#             mode,
#             question,
#             num_chunks,
#             answer.replace("\n", " ").strip()
#         ])


# def detect_mode(question: str) -> str:
#     """Classify a question as 'solve' (computation) or 'theory' (concept lookup)."""
#     solve_signals = r'\b(solve|calculate|compute|evaluate|find x|simplify)\b|[=]|\d+[\+\-\*/]\d+'
#     return "solve" if re.search(solve_signals, question, re.IGNORECASE) else "theory"


# def build_prompt(mode, context, question):
#     base_style = """You are a friendly and knowledgeable math tutor, helping anyone who wants to master mathematics 
#     from students preparing for international university study to anyone strengthening their math skills.
#     Format all mathematical notation using LaTeX syntax wrapped in dollar signs:
#     use $...$ for inline math (e.g. $x^2$) and $$...$$ for block equations 
#     (e.g. $$\\int_0^1 x^2 dx$$). Do not use plain text for formulas."""

#     if mode == "theory":
#         return f"""{base_style}

#     Only answer based on the context below. Do not use any outside knowledge.
#     When the context contains mathematical notation, symbols, or formulas (such as limits, derivatives, 
#     integrals, or equations), preserve and include them in your answer exactly as written — do not convert 
#     them into plain English description only.
#     If the context does not contain enough information to answer the question, respond with:
#     "Sorry, there is no information based on what I was trained on. I cannot find an answer related to this."

#     Context:
#     {context}

#     Question: {question}"""

#     else:  # mode == "solve"
#         return f"""{base_style}

#     Solve the following problem step-by-step using standard mathematical reasoning. 
#     You may use general math knowledge even if it is not in the provided context — 
#     this is a computation/practice question, not a theory lookup.
#     Show your work clearly, one step at a time, and give the final answer at the end.

#     Question: {question}"""


# def generate_answer(question, chunks, mode="theory"):
#     context = "\n".join(chunks)
#     prompt = build_prompt(mode, context, question)

#     try:
#         response = client.messages.create(
#             model=MODEL_NAME,
#             max_tokens=1000,
#             messages=[
#                 {"role": "user", "content": prompt}
#             ]
#         )
#         return response.content[0].text
#     except Exception as e:
#         return f"Error generating answer: {e}"


# if __name__ == "__main__":
#     print("=" * 50)
#     print("Welcome to MathMate Chatbot")
#     print("=" * 50)
#     print("1. Calculus")
#     print("2. Statistics")
#     print("3. Algebra1")
#     print("4. Calculus2")

#     choice = input("\nChoose a subject (1/4): ").strip()
#     if choice not in SUBJECTS:
#         print("Invalid choice. Exiting.")
#         exit()

#     subject = SUBJECTS[choice]
#     print(f"\nLoaded subject: {subject['name'].capitalize()}")
#     print("Type 'exit' to quit")
#     print("=" * 50)

#     while True:
#         question = input("\nYou: ").strip()
#         if not question:
#             continue
#         if question.lower() == "exit":
#             print("Goodbye!")
#             break

#         mode = detect_mode(question)

#         if mode == "theory":
#             chunks = retrieve(question, subject["path"], subject["topics"])
#             if not chunks:
#                 answer = "I couldn't find anything relevant in the textbook for that."
#             else:
#                 answer = generate_answer(question, chunks, mode=mode)
#         else:
#             chunks = []
#             answer = generate_answer(question, chunks, mode=mode)

#         print(f"\nBot: {answer}")
#         log_chat(subject["name"], question, len(chunks), answer, mode=mode)

import warnings
warnings.filterwarnings("ignore")

import os
import csv
import base64
from datetime import datetime
import anthropic
from dotenv import load_dotenv
from retreival import retrieve, SUBJECTS

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

MODEL_NAME = "claude-haiku-4-5"
LOG_FILE = "chat_log.csv"


def log_chat(subject_name, question, num_chunks, answer):
    """Append one Q&A turn to a CSV log file."""
    file_exists = os.path.isfile(LOG_FILE)

    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["timestamp", "subject", "question", "num_chunks", "answer"])

        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            subject_name,
            question,
            num_chunks,
            answer.replace("\n", " ").strip()
        ])


def generate_answer(question, chunks):
    """Theory/RAG answer — strictly grounded in retrieved textbook context."""
    context = "\n".join(chunks)
    prompt = f"""You are a friendly and knowledgeable math tutor, helping anyone who wants to master mathematics 
    from students preparing for international university study to anyone strengthening their math skills.
    Format all mathematical notation using LaTeX syntax wrapped in dollar signs:
    use $...$ for inline math (e.g. $x^2$) and $$...$$ for block equations 
    (e.g. $$\\int_0^1 x^2 dx$$). Do not use plain text for formulas.
    Only answer based on the context below. Do not use any outside knowledge.
    When the context contains mathematical notation, symbols, or formulas (such as limits, derivatives, 
    integrals, or equations), preserve and include them in your answer exactly as written — do not convert 
    them into plain English description only.
    If the context does not contain enough information to answer the question, respond with:
    "Sorry, there is no information based on what I was trained on. I cannot find an answer related to this."

Context:
{context}

Question: {question}
Answer:"""

    try:
        response = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    except Exception as e:
        return f"Error generating answer: {e}"


def generate_answer_from_image(image_bytes, media_type="image/jpeg"):
    """Quiz image -> Claude solves it directly, no retrieval, no subject needed."""
    image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

    prompt_text = """You are a friendly and knowledgeable math tutor. 
    Look at the math problem in this image and solve it step-by-step.
    Format all mathematical notation using LaTeX syntax wrapped in dollar signs:
    use $...$ for inline math and $$...$$ for block equations.
    Show your work clearly, then give the final answer."""

    try:
        response = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_b64
                            }
                        },
                        {"type": "text", "text": prompt_text}
                    ]
                }
            ]
        )
        return response.content[0].text
    except Exception as e:
        return f"Error generating answer: {e}"


if __name__ == "__main__":
    print("=" * 50)
    print("Welcome to MathMate Chatbot")
    print("=" * 50)
    print("1. Calculus")
    print("2. Statistics")
    print("3. Algebra1")
    print("4. Calculus2")

    choice = input("\nChoose a subject (1/4): ").strip()
    if choice not in SUBJECTS:
        print("Invalid choice. Exiting.")
        exit()

    subject = SUBJECTS[choice]
    print(f"\nLoaded subject: {subject['name'].capitalize()}")
    print("Type 'exit' to quit")
    print("=" * 50)

    while True:
        question = input("\nYou: ").strip()
        if not question:
            continue
        if question.lower() == "exit":
            print("Goodbye!")
            break

        chunks = retrieve(question, subject["path"], subject["topics"])

        if not chunks:
            answer = "I couldn't find anything relevant in the textbook for that."
            print(f"Bot: {answer}")
        else:
            answer = generate_answer(question, chunks)
            print(f"\nBot: {answer}")

        log_chat(subject["name"], question, len(chunks), answer)