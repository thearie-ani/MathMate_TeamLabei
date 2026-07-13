# import warnings
# warnings.filterwarnings("ignore")

# import os
# import google.generativeai as genai
# from dotenv import load_dotenv
# from retreival import retrieve

# load_dotenv()
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# def generate_answer(question, chunks):
#     context = "\n".join(chunks)
#     #Telling our google api its role
#     prompt = f"""You are a planet expert chatbot.
# Only answer based on this context:
# {context}

# Question: {question}
# Answer:"""

#     # model = genai.GenerativeModel("gemini-2.5-flash-lite")
#     model = genai.GenerativeModel("gemini-1.0-pro")
#     response = model.generate_content(prompt)
#     return response.text
# if __name__ == "__main__":
#     print("=" * 50)
#     print("Welcome to Phub Chlart Vey CHATBOT")
#     print("Type 'exit' to quit")
#     print("=" * 50)

#     while True:
#         question = input("\nYou: ").strip()
#         if not question:
#             continue
#         if question.lower() == "exit":
#             print("Goodbye!")
#             break

#         # Retrieve relevant chunks
#         chunks = retrieve(question)

#         if not chunks:
#             print("Bot: I only know about the 8 planets!")
#         else:
#             # Generate answer from Gemini
#             answer = generate_answer(question, chunks)
#             print(f"\nBot: {answer}")


# import warnings
# warnings.filterwarnings("ignore")

# import os
# import google.generativeai as genai
# from dotenv import load_dotenv
# from retreival import retrieve, SUBJECTS

# load_dotenv()
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# MODEL_NAME = "gemini-2.5-flash-lite"

# def generate_answer(question, chunks):
#     context = "\n".join(chunks)

#     prompt = f"""You are a friendly and knowledgeable math tutor, helping anyone who wants to master mathematics 
#       from students preparing for international university study to anyone strengthening their math skills.
#       Only answer based on the context below. Do not use any outside knowledge.
#       When the context contains mathematical notation, symbols, or formulas (such as limits, derivatives, 
#       integrals, or equations), preserve and include them in your answer exactly as written — do not convert 
#       them into plain English description only.
#       If the context does not contain enough information to answer the question, respond with:
#       "Sorry, there is no information based on what I was trained on. I cannot find an answer related to this."

# Context:
# {context}

# Question: {question}
# Answer:"""

#     model = genai.GenerativeModel(MODEL_NAME)

#     try:
#         response = model.generate_content(prompt)
#         return response.text
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

#         chunks = retrieve(question, subject["path"], subject["topics"])

#         if not chunks:
#             print("Bot: I couldn't find anything relevant in the textbook for that.")
#         else:
#             answer = generate_answer(question, chunks)
#             print(f"\nBot: {answer}")





import warnings
warnings.filterwarnings("ignore")

import os
import csv
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
            messages=[
                {"role": "user", "content": prompt}
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