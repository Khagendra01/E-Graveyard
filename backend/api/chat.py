from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from langchain_community.vectorstores import Chroma
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from typing_extensions import TypedDict
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langgraph.graph import StateGraph, END

load_dotenv()

def get_llm():
    return ChatOpenAI(temperature=0, model="gpt-4o-mini")

def get_embeddings():
    return OpenAIEmbeddings()

embedding_function = get_embeddings()

docs = [
    Document(
        page_content="Elon Musk is founder of Tesla. He was born in South Africa and moved to the United States to pursue his entrepreneurial dreams.",
        metadata={"source": "elon_musk.txt"},
    ),
    Document(
        page_content="Elon Musk is also the CEO and founder of SpaceX, a company dedicated to reducing space transportation costs and enabling the colonization of Mars.",
        metadata={"source": "spacex.txt"},
    ),
    Document(
        page_content="Before Tesla and SpaceX, Elon Musk co-founded Zip2, an online city guide software for newspapers, which was sold for nearly $300 million.",
        metadata={"source": "zip2.txt"},
    ),
    Document(
        page_content="Elon Musk is known for his ambitious goals, including the development of the Hyperloop, a high-speed transportation system, and Neuralink, a neurotechnology company.",
        metadata={"source": "hyperloop_neuralink.txt"},
    ),
    Document(
        page_content="In 2021, Elon Musk briefly became the world's richest person, reflecting the substantial impact of Tesla's stock performance and his business ventures.",
        metadata={"source": "musk_richest_person.txt"},
    ),
    Document(
        page_content="Elon Musk's ventures include The Boring Company, which aims to reduce traffic congestion through a network of underground tunnels.",
        metadata={"source": "boring_company.txt"},
    ),
    Document(
        page_content="Musk has also been involved in philanthropic efforts, including donations to education and health causes, and he has pledged to give away much of his wealth during his lifetime.",
        metadata={"source": "musk_philanthropy.txt"},
    ),
]


db = Chroma.from_documents(docs, embedding_function)
retriever = db.as_retriever()

class AgentState(TypedDict):
    question: str
    grades: list[str]
    llm_output: str
    documents: list[str]
    on_topic: bool
    past_convo: str

def retrieve_docs(state: AgentState):
    question = state["question"]
    documents = retriever.invoke(input=question)
    state["documents"] = [doc.page_content for doc in documents]
    return state

class GradeQuestion(BaseModel):
    """Boolean value to check whether a question is releated to the grave model person"""

    score: str = Field(
        description="Question is about Elon Musk? If yes -> 'Yes' if not -> 'No'"
    )


def question_classifier(state: AgentState):
    question = state["question"]
    past_convo = "This is the past conversation: " + str(state["past_convo"])

    system = """You are a grader assessing the topic a user question. \n
        Only answer if the question is about one of the following topics:
        1. Related to past conversations
        2. Talk about any detail of Elon Musk

        Examples: How will the weather be today -> No
                  Is (User) still alive -> Yes
                  What was (User) most humble moment -> Yes

        If the question IS about these topics response with "Yes", otherwise respond with "No".
        """

    system = system + past_convo

    grade_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "User question: {question}"),
        ]
    )

    llm = get_llm()
    structured_llm = llm.with_structured_output(GradeQuestion)
    grader_llm = grade_prompt | structured_llm
    result = grader_llm.invoke({"question": question})
    state["on_topic"] = result.score
    return state

def on_topic_router(state: AgentState):
    on_topic = state["on_topic"]
    if on_topic.lower() == "yes":
        return "on_topic"
    return "off_topic"

def off_topic_response(state: AgentState):
    llm = get_llm()
    question = state["question"]
    past_convo = state["past_convo"]
    

    template = """Answer the question if only any detail related to past conversations.:
    Past Conversation: {past_convo}
    Question: {question}
    Else reply "I cant respond to that!"
    """

    prompt = ChatPromptTemplate.from_template(
        template=template,
    )

    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"question": question, "past_convo": past_convo})
    state["llm_output"] = result
    return state


class GradeDocuments(BaseModel):
    """Boolean values to check for relevance on retrieved documents."""

    score: str = Field(
        description="Documents are relevant to the question, 'Yes' or 'No'"
    )


def document_grader(state: AgentState):
    docs = state["documents"]
    question = state["question"]

    system = """You are a grader assessing relevance of a retrieved document to a user question. \n
        If the document contains keyword(s) or semantic meaning related to the question, grade it as relevant. \n
        Give a binary score 'Yes' or 'No' score to indicate whether the document is relevant to the question."""

    grade_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            (
                "human",
                "Retrieved document: \n\n {document} \n\n User question: {question}",
            ),
        ]
    )

    llm = get_llm()
    structured_llm = llm.with_structured_output(GradeDocuments)
    grader_llm = grade_prompt | structured_llm
    scores = []
    for doc in docs:
        result = grader_llm.invoke({"document": doc, "question": question})
        scores.append(result.score)
    state["grades"] = scores
    return state

def gen_router(state: AgentState):
    grades = state["grades"]

    if any(grade.lower() == "yes" for grade in grades):
        filtered_grades = [grade for grade in grades if grade.lower() == "yes"]
        return "generate"
    else:
        return "rewrite_query"
    
def rewriter(state: AgentState):
    question = state["question"]
    system = """You a question re-writer that converts an input question to a better version that is optimized \n
        for retrieval. Look at the input and try to reason about the underlying semantic intent / meaning. If needed use past conversation."""
    past_convo = "This is the past conversation: " + str(state["past_convo"])
    system = system + past_convo

    re_write_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            (
                "human",
                "Here is the initial question: \n\n {question} \n Formulate an improved question.",
            ),
        ]
    )
    llm = get_llm()
    question_rewriter = re_write_prompt | llm | StrOutputParser()
    output = question_rewriter.invoke({"question": question})
    state["question"] = output
    return state

def generate_answer(state: AgentState):
    llm = get_llm()
    question = state["question"]
    context = state["documents"]
    past_convo = state["past_convo"]
    

    template = """Answer the question based only on the following context or past conversations.:
    {context}
    Past Conversation: {past_convo}
    Question: {question}
    """

    prompt = ChatPromptTemplate.from_template(
        template=template,
    )

    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"question": question, "context": context, "past_convo": past_convo})
    state["llm_output"] = result
    return state

workflow = StateGraph(AgentState)

workflow.add_node("topic_decision", question_classifier)
workflow.add_node("off_topic_response", off_topic_response)
workflow.add_node("retrieve_docs", retrieve_docs)
workflow.add_node("rewrite_query", rewriter)
workflow.add_node("generate_answer", generate_answer)
workflow.add_node("document_grader", document_grader)

workflow.add_edge("off_topic_response", END)
workflow.add_edge("retrieve_docs", "document_grader")
workflow.add_conditional_edges(
    "topic_decision",
    on_topic_router,
    {
        "on_topic": "retrieve_docs",
        "off_topic": "off_topic_response",
    },
)
workflow.add_conditional_edges(
    "document_grader",
    gen_router,
    {
        "generate": "generate_answer",
        "rewrite_query": "rewrite_query",
    },
)
workflow.add_edge("rewrite_query", "retrieve_docs")
workflow.add_edge("generate_answer", END)


workflow.set_entry_point("topic_decision")

app = workflow.compile()

past_convo = """

User: How is the weather?
Bot: I can't respond to that!

User: Who is the owner of bella vista?
Bot: The owner of Bella Vista is Antonio Rossi.
User: My name is Kgen.
Bot: Nice, how are you Kgen?
User: I am fine. Thanks for asking.
Bot: Good.
User: I am 21 years old studying in caldwell university.
"""

result = app.invoke({"question": "How is the weather?", "past_convo": past_convo})
print(result["llm_output"])

result = app.invoke({"question": "What is my name?", "past_convo": past_convo})
print(result["llm_output"])

result = app.invoke({"question": "What is my age?", "past_convo": past_convo})
print(result["llm_output"])