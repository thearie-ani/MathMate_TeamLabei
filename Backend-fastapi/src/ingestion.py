
# import warnings
# warnings.filterwarnings("ignore")
# import os
# import json
# import faiss
# import numpy as np
# from langchain_community.document_loaders import TextLoader, DirectoryLoader
# from langchain_community.document_loaders import PyMuPDFLoader
# from langchain_text_splitters import CharacterTextSplitter
# from sentence_transformers import SentenceTransformer
# from dotenv import load_dotenv

# load_dotenv()

# FAISS_PATH = "faiss-vector-store"

# # def load_documents(docs_path="docs"):
# #     loader = DirectoryLoader(
# #         path=docs_path,
# #         glob="*.txt",
# #         loader_cls=TextLoader,
# #         loader_kwargs={"encoding": "utf-8"}
        
# #     )
# #     documents = loader.load()

# #     if len(documents) == 0:
# #         raise FileNotFoundError(f"No .txt files found in {docs_path}")

# #     for i, doc in enumerate(documents[:2]):
# #         print(f"\nDocument {i+1}:")
# #         print(f"  Source: {doc.metadata['source']}")
# #         print(f"  Content length: {len(doc.page_content)} characters")
# #         print(f"  Content preview: {doc.page_content[:100]}...")
# #         print(f"  metadata: {doc.metadata}")

# #     return documents

# def load_documents(pdf_path):
#     loader = PyMuPDFLoader(pdf_path)

#     documents = loader.load()

#     if len(documents) == 0:
#         raise FileNotFoundError(f"No pages found in {pdf_path}")

#     print(f"\nLoaded {len(documents)} pages")

#     for i, doc in enumerate(documents[:2]):
#         print(f"\nPage {i+1}:")
#         print(f"Content length: {len(doc.page_content)} characters")
#         print(f"Content preview: {doc.page_content[:200]}...")
#         print(f"Metadata: {doc.metadata}")

#     return documents

# def split_documents(documents, chunk_size=500, chunk_overlap=50):
#     print("Splitting documents into chunks...")

#     text_splitter = CharacterTextSplitter(
#         chunk_size=chunk_size,
#         chunk_overlap=chunk_overlap,
#         separator="\n"
#     )

#     chunks = text_splitter.split_documents(documents)

#     if chunks:
#         for i, chunk in enumerate(chunks[:9]):
#             print(f"\n--- Chunk {i+1} ---")
#             print(f"Source: {chunk.metadata['source']}")
#             print(f"Length: {len(chunk.page_content)} characters")
#             print(f"Content:")
#             print(chunk.page_content)
#             print("-" * 50)

#         if len(chunks) > 5:
#             print(f"\n... and {len(chunks) - 5} more chunks")

#     return chunks

# def create_vector_database(chunks):
#     # Choose model for sentence transformer
#     model = SentenceTransformer("all-MiniLM-L6-v2")
#     #Create embedding
#     contents = [chunk.page_content for chunk in chunks]
#     embeddings = model.encode(contents, show_progress_bar=True)
#     # FAISS accepts only float32 and numpy array
#     embeddings = np.array(embeddings, dtype="float32")

#     # Create IndexFlatL2
#     # flat = search all vectors
#     # L2 = distance matrix concept
#     d = embeddings.shape[1]
#     index = faiss.IndexFlatL2(d)
#     print(f"Is trained: {index.is_trained}")
#     index.add(embeddings)
#     print(f"Total vectors: {index.ntotal}")


#     #Save vector database file
#     os.makedirs(FAISS_PATH, exist_ok=True)
#     faiss.write_index(index, f"{FAISS_PATH}/index.faiss")
#     with open(f"{FAISS_PATH}/chunks.json", "w",encoding="utf-8") as f:
#         json.dump(contents, f, ensure_ascii=False, indent=2)

#     print(f"\n Saved to {FAISS_PATH}!")

# def main():
#     print("MathMate")
    
#     #Loading documents
#     document = load_documents(pdf_path = "../dataset/calculus-volume-1_-_WEB.pdf")
#     #Chunking our dataset
#     chunks = split_documents(document)
#     #Embedding chunk and store it into vector database using FAISS
#     create_vector_database(chunks)

# if __name__ == "__main__":
#     main()


import warnings
warnings.filterwarnings("ignore")
import os
import json
import faiss
import numpy as np
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

def load_documents(pdf_path):
    loader = PyMuPDFLoader(pdf_path)
    documents = loader.load()

    if len(documents) == 0:
        raise FileNotFoundError(f"No pages found in {pdf_path}")

    print(f"\nLoaded {len(documents)} pages from {pdf_path}")
    return documents

def split_documents(documents, chunk_size=500, chunk_overlap=50):
    print("Splitting documents into chunks...")
    text_splitter = CharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separator="\n"
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks")
    return chunks

def create_vector_database(chunks, faiss_path):
    model = SentenceTransformer("all-MiniLM-L6-v2")
    contents = [chunk.page_content for chunk in chunks]
    embeddings = model.encode(contents, show_progress_bar=True)
    embeddings = np.array(embeddings, dtype="float32")

    d = embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    index.add(embeddings)
    print(f"Total vectors: {index.ntotal}")

    os.makedirs(faiss_path, exist_ok=True)
    faiss.write_index(index, f"{faiss_path}/index.faiss")
    with open(f"{faiss_path}/chunks.json", "w", encoding="utf-8") as f:
        json.dump(contents, f, ensure_ascii=False, indent=2)

    print(f"\n Saved to {faiss_path}!")

def build_index(pdf_path, faiss_path):
    print(f"\n{'='*50}\nBuilding index: {faiss_path}\n{'='*50}")
    documents = load_documents(pdf_path)
    print(f"DEBUG: {len(documents)} documents loaded")
    print(f"DEBUG: first doc content length: {len(documents[0].page_content) if documents else 'N/A'}")

    chunks = split_documents(documents)
    print(f"DEBUG: {len(chunks)} chunks created")

    create_vector_database(chunks, faiss_path)

if __name__ == "__main__":
    # Calculus
    build_index(
        pdf_path="../dataset/calculus-volume-1_-_WEB.pdf",
        faiss_path="faiss-vector-store-calculus1"
    )

    # Statistics
    build_index(
        pdf_path="../dataset/introductory-statistics-2e_-_WEB.pdf",
        faiss_path="faiss-vector-store-statistics"
    )
    build_index(
        pdf_path="../dataset/calculus-volume-2_-_WEB.pdf",
        faiss_path="faiss-vector-store-calculus2"
    )
    build_index(
        pdf_path="../dataset/algebra-1_-_WEB.pdf",
        faiss_path="faiss-vector-store-algebra1"
    )