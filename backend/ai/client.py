import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_agent(system_prompt, data):
    """
    Send data to Gemini and return the AI response.

    If Gemini is temporarily unavailable, return a clear
    fallback message instead of crashing the entire pipeline.
    """

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=(
                f"{system_prompt}\n\n"
                f"Data:\n{json.dumps(data, default=str)}"
            ),
        )

        return response.text

    except Exception as error:
        return (
            "AI analysis temporarily unavailable. "
            f"The underlying reconciliation result is still available. "
            f"Error: {error}"
        )