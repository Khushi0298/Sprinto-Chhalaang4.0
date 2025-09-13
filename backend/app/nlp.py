import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

async def extract_intent(query: str):
    prompt = f"""
    You are an intent extractor for an Evidence-on-Demand bot.
    Given a query, classify it into one of these intents:
    - github_pr
    - jira_ticket
    - asset_request
    - unknown

    Extract parameters if available (e.g., PR number, ticket ID, asset type).

    Query: {query}
    Respond in JSON with fields: intent, parameters.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )
    return response.choices[0].message["content"]
