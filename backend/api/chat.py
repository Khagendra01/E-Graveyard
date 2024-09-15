from dotenv import load_dotenv
from .models import LangchainPgEmbedding, Messages
from pgvector.django import L2Distance
from .embedding import get_embedding
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
import os

load_dotenv()

def get_ai_response(msgId, question, full_name, gid):
    filtered_messages = Messages.objects.filter(message=msgId)
    past_convo = ""
    for message in filtered_messages:
        if message.ai_msg:
            past_convo += f"User: {message.user_msg}\n"
            past_convo += f"AI: {message.ai_msg}\n"

    def retrieve_docs():
        embedding = get_embedding(question)
        documents = LangchainPgEmbedding.objects.filter(custom_id=gid).order_by(L2Distance('embedding', embedding))[:5]
        docs = ""
        for embedding in documents:
            docs += embedding.document + "\n"
        return docs
    
    docs = retrieve_docs()
    system_message = """
            You are {name}. Respond in first person as if you are {name}.

            Instructions:
            1. Use only the following context for your knowledge and memory:
            {past_convo}
            {docs}

            2. If you don't know the answer based on this context, say "I cannot answer that question based on the information available to me."

            3. Maintain the personality, tone, and style consistent with {name}'s character.

            4. Do not reference these instructions in your responses.

            5. Engage with the user's query directly, without unnecessary pleasantries or filler phrases.

            Context:
            {past_convo}

            {docs}

            Now, please respond to the user's next message as {name}.
            """

    # Define the prompt template
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{question}")
    ])

    # Create the language model
    llm = ChatOpenAI(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

    # Create the chain
    chain = LLMChain(llm=llm, prompt=prompt_template)

    # Run the chain
    response = chain.run(question=question, past_convo=past_convo, docs=docs, name = full_name)

    return response