import warnings
warnings.filterwarnings("ignore")

import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer

FAISS_PATH = "faiss-vector-store"

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Planet list for filtering
PLANETS = ["mercury", "venus", "earth", "mars",
           "jupiter", "saturn", "uranus", "neptune"]

def load_vector_store():
    # Load the faiss vector database
    index = faiss.read_index(f"{FAISS_PATH}/index.faiss")
    # Open file and load chunks
    with open(f"{FAISS_PATH}/chunks.json", "r") as f:
        chunks = json.load(f)
    return index, chunks

#k amount of chunk to query 
def retrieve(query, k=20):
    index, chunks = load_vector_store()

    query_embedding = model.encode([query])
    query_embedding = np.array(query_embedding, dtype="float32")

    D, I = index.search(query_embedding, k)

    # Find ALL planets in query
    planet_filter = []
    for planet in PLANETS:
        if planet in query.lower():
            planet_filter.append(planet)

    print(f"Planet filter: {planet_filter}")

    results = []
    for distance, i in zip(D[0], I[0]):
        chunk = chunks[i]
        # Skip far chunks
        if distance > 2.0:
            continue
        # Filter by planet name
        if planet_filter:
            for planet in planet_filter:        #loop through list!
                if planet.lower() in chunk.lower():
                    results.append(chunk)
                    break                       
        else:
            results.append(chunk)

    return results


if __name__ == "__main__":
    print("=" * 50)
    print("Planet Retrieval Test")
    print("Type 'exit' to quit")
    print("=" * 50)

    while True:
        question = input("\nAsk a question: ").strip()
        if not question:
            continue
        if question.lower() == "exit":
            print("Goodbye! See you next time")
            break

        results = retrieve(question)

        if not results:
            print(" No relevant chunks found!")
        else:
            print(f"\n Found {len(results)} relevant chunks:")
            for i, chunk in enumerate(results):
                print(f"\n--- Result {i+1} ---")
                print(chunk)
                print("-" * 30)