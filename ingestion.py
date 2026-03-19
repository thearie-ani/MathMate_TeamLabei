
# import os
# import json
# from langchain_community.document_loaders import TextLoader, DirectoryLoader
# from langchain_text_splitters import CharacterTextSplitter
# # from langchain_openai import OpenAIEmbeddings
# # from langchain_chroma import Chroma
# import faiss
# from dotenv import load_dotenv
# from sentence_transformers import SentenceTransformer
# import numpy as np

# load_dotenv()


# FAISS_PATH = "faiss-vector-store"

# #load document
# def load_documents(docs_path="docs"):
#     loader = DirectoryLoader(
#         path=docs_path,
#         glob="*.txt",
#         loader_cls=TextLoader
#     )
#     documents = loader.load()
    
#     if len(documents) == 0:
#         raise FileNotFoundError(f"No .txt files found in {docs_path}")
    
#     for i, doc in enumerate(documents[:2]):
#         print(f"\nDocument {i+1}:")
#         print(f"  Source: {doc.metadata['source']}")
#         print(f"  Content length: {len(doc.page_content)} characters")
#         print(f"  Content preview: {doc.page_content[:100]}...")
#         print(f"  metadata: {doc.metadata}")
    
#     return documents

# # def split_data(document):
# #     text_splitter=CharacterTextSplitter(
# #         chunk_size = 4000,
# #         chunk_overlap = 200,
# #         length_function = len,
# #         keep_separator= False,
# #         add_start_index= False,
# #         strip_whitespace = True
    
# #     )
# #     chunk = text_splitter.split_documents(document)
# #     print(f"Chunk len is {len(chunk)}")
# #     return chunk


# #chunkinhg
# def split_documents(documents, chunk_size=500, chunk_overlap=20):
#     """Split documents into smaller chunks with overlap"""
#     print("Splitting documents into chunks...")
    
#     text_splitter = CharacterTextSplitter(
#         chunk_size=chunk_size, 
#         chunk_overlap=chunk_overlap,
#         separator="\n"
#     )
    
#     chunks = text_splitter.split_documents(documents)
    
#     if chunks:
    
#         for i, chunk in enumerate(chunks[:5]):
#             print(f"\n--- Chunk {i+1} ---")
#             print(f"Source: {chunk.metadata['source']}")
#             print(f"Length: {len(chunk.page_content)} characters")
#             print(f"Content:")
#             print(chunk.page_content)
#             print("-" * 50)
        
#         if len(chunks) > 5:
#             print(f"\n... and {len(chunks) - 5} more chunks")
    
#     return chunks
# #create and store vector in faiss
# def create_vector_database(chunks, persist_direction="faiss-vector-store"):
#     #we have to chose model for our sentencetransformer
#     model = SentenceTransformer("all-MiniLM-L6-v2")  

#     #create embedding
#     contents = [chunk.page_content for chunk in chunks]
#     embeddings = model.encode(contents, show_progress_bar=True)
#     embeddings = np.array(embeddings, dtype="float32")  #faise accept only float32(decimal 32) and array as numpy only

#     #create indexflatL2(l2=distance matrix flat is search to all vectors and with l2 concept)
#     d=embeddings.shape[1]
#     index=faiss.IndexFlatL2(d)  #create faiss empty database
#     print(index.is_trained)
#     index.add(embeddings)
#     print(f"Total vectors: {index.ntotal}")

#     #save file
#     os.makedirs(FAISS_PATH, exist_ok=True)
#     faiss.write_index(index, f"{FAISS_PATH}/index.faiss")

#     with open(f"{FAISS_PATH}/chunks.json", "w") as f:
#         json.dump(contents, f, ensure_ascii=False,indent=2)
   
    
#     #query vector
#     xq=model.encode(['Temperature of mar'])
#     xq = np.array(xq, dtype="float32")
#     k=4
#     D,I = index.search(xq,k)
#     for i in I[0]:
#         print(f"{i}:{contents[i]}")



# def main():
#     print("PHUB CHLARTVEY")

#     #loading the file
#     document=load_documents(docs_path="planet_dataset")
#     #chunking the file
#     chunks=split_documents(document)
#     #embedding and storing in the vector database(faiass)
#     create_vector_database(chunks)




# if __name__ == "__main__":
#     main()




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
        loader_cls=TextLoader
        
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
    model = SentenceTransformer("all-MiniLM-L6-v2")

    contents = [chunk.page_content for chunk in chunks]
    embeddings = model.encode(contents, show_progress_bar=True)
    embeddings = np.array(embeddings, dtype="float32")

    d = embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    print(f"Is trained: {index.is_trained}")
    index.add(embeddings)
    print(f"Total vectors: {index.ntotal}")

    os.makedirs(FAISS_PATH, exist_ok=True)
    faiss.write_index(index, f"{FAISS_PATH}/index.faiss")
    with open(f"{FAISS_PATH}/chunks.json", "w") as f:
        json.dump(contents, f, ensure_ascii=False, indent=2)

    print(f"\n Saved to {FAISS_PATH}!")

def main():
    print("PHUB CHLARTVEY")
    document = load_documents(docs_path="planet_dataset")
    chunks = split_documents(document)
    create_vector_database(chunks)

if __name__ == "__main__":
    main()