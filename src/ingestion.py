import warnings
warnings.filterwarnings("ignore")
import os
import json
import faiss
import numpy as np
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import CharacterTextSplitter
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

FAISS_PATH = "faiss-vector-store"

def load_documents(docs_path="docs"):
    loader = DirectoryLoader(
        path=docs_path,
        glob="*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"}
        
    )
    documents = loader.load()

    if len(documents) == 0:
        raise FileNotFoundError(f"No .txt files found in {docs_path}")

    for i, doc in enumerate(documents[:2]):
        print(f"\nDocument {i+1}:")
        print(f"  Source: {doc.metadata['source']}")
        print(f"  Content length: {len(doc.page_content)} characters")
        print(f"  Content preview: {doc.page_content[:100]}...")
        print(f"  metadata: {doc.metadata}")

    return documents

def split_documents(documents, chunk_size=100, chunk_overlap=10):
    print("Splitting documents into chunks...")

    text_splitter = CharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separator="\n"
    )

    chunks = text_splitter.split_documents(documents)

    if chunks:
        for i, chunk in enumerate(chunks[:5]):
            print(f"\n--- Chunk {i+1} ---")
            print(f"Source: {chunk.metadata['source']}")
            print(f"Length: {len(chunk.page_content)} characters")
            print(f"Content:")
            print(chunk.page_content)
            print("-" * 50)

        if len(chunks) > 5:
            print(f"\n... and {len(chunks) - 5} more chunks")

    return chunks

def create_vector_database(chunks):
    # Choose model for sentence transformer
    model = SentenceTransformer("all-MiniLM-L6-v2")
    #Create embedding
    contents = [chunk.page_content for chunk in chunks]
    embeddings = model.encode(contents, show_progress_bar=True)
    # FAISS accepts only float32 and numpy array
    embeddings = np.array(embeddings, dtype="float32")

    # Create IndexFlatL2
    # flat = search all vectors
    # L2 = distance matrix concept
    d = embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    print(f"Is trained: {index.is_trained}")
    index.add(embeddings)
    print(f"Total vectors: {index.ntotal}")


    #Save vector database file
    os.makedirs(FAISS_PATH, exist_ok=True)
    faiss.write_index(index, f"{FAISS_PATH}/index.faiss")
    with open(f"{FAISS_PATH}/chunks.json", "w") as f:
        json.dump(contents, f, ensure_ascii=False, indent=2)

    print(f"\n Saved to {FAISS_PATH}!")

def main():
    print("PHUB CHLARTVEY")
    
    #Loading documents
    document = load_documents(docs_path="planet_dataset")
    #Chunking our dataset
    chunks = split_documents(document)
    #Embedding chunk and store it into vector database using FAISS
    create_vector_database(chunks)

if __name__ == "__main__":
    main()