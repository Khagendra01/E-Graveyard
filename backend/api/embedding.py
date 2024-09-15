import openai
from dotenv import load_dotenv
import os
load_dotenv()

def get_embedding(text):
    text = text.replace("\n", " ")
    return openai.Embedding.create(input=text, api_key=os.getenv("OPENAI_API_KEY"), engine="text-embedding-ada-002")["data"][0]["embedding"]

# from dotenv import load_dotenv
# from langchain.schema import Document
# from langchain_openai import OpenAIEmbeddings
# load_dotenv()

# def get_embedding(text):
#     embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
#     document = Document(page_content=text)
#     embedding = embeddings.embed_documents([document.page_content])
#     return embedding

# from langchain.embeddings import OpenAIEmbeddings
# from dotenv import load_dotenv
# load_dotenv()


# embeddings = OpenAIEmbeddings()

# def get_embedding(text):
#     vector = embeddings.embed_query(text)
#     return vector
