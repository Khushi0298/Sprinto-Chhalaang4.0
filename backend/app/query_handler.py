from app.nlp import extract_intent

async def handle_query(query: str):
    intent_json = await extract_intent(query)
    # For now, just return the extracted intent
    return {"query": query, "intent": intent_json}
