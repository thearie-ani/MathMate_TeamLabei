import warnings
warnings.filterwarnings("ignore")

import os
import google.generativeai as genai
from dotenv import load_dotenv
from retreival import retrieve

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_answer(question, chunks):
    context = "\n".join(chunks)
    #Telling our google api its role
    prompt = f"""You are a planet expert chatbot.
Only answer based on this context:
{context}

Question: {question}
Answer:"""

    model = genai.GenerativeModel("gemini-2.5-flash-lite-preview-09-2025")
    response = model.generate_content(prompt)
    return response.text
if __name__ == "__main__":
    print("=" * 50)
    print("Welcome to Phub Chlart Vey CHATBOT")
    print("Type 'exit' to quit")
    print("=" * 50)

    while True:
        question = input("\nYou: ").strip()
        if not question:
            continue
        if question.lower() == "exit":
            print("Goodbye!")
            break

        # Retrieve relevant chunks
        chunks = retrieve(question)

        if not chunks:
            print("Bot: I only know about the 8 planets!")
        else:
            # Generate answer from Gemini
            answer = generate_answer(question, chunks)
            print(f"\nBot: {answer}")