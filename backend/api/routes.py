from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.services.close import run_close
from backend.ai.client import ask_agent


router = APIRouter()


class AssistantRequest(BaseModel):
    question: str
    context: dict


@router.post("/close")
def run_close_endpoint(month: str):
    """
    Run the month-end close pipeline for a selected month.
    """

    if len(month) != 7 or month[4] != "-":
        raise HTTPException(
            status_code=400,
            detail="Month must use YYYY-MM format."
        )

    try:
        return run_close(month)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"No financial data found for {month}."
        )


@router.post("/assistant")
def assistant_endpoint(request: AssistantRequest):
    """
    Answer a user's question about the current month-end close.
    """

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    system_prompt = """
You are ClosePilot, an AI financial close assistant.

You help finance teams understand their month-end close data.

Answer the user's question using only the financial data provided
in the context.

Be concise and specific.

If the data does not contain enough information to answer the question,
say so clearly rather than making up information.

When discussing exceptions, explain what requires attention and why.

Do not claim that an issue is resolved unless the provided data shows
that it is resolved.
"""

    try:
        answer = ask_agent(
            system_prompt,
            {
                "question": request.question,
                "close_data": request.context,
            },
        )

        return {
            "answer": answer
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Assistant request failed: {error}"
        )