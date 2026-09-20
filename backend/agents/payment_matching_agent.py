from backend.reconciliation.payment_matching import resolve_payment
from backend.ai.receivables_agent import analyze_payment as ai_analyze_payment


def analyze_payment(payment, invoices):
    """
    Match a payment against invoices.

    Exact matches are handled by deterministic matching logic.
    Near matches are sent to the Receivables Agent for AI analysis.
    Mismatches are sent for human review.
    """

    result = resolve_payment(
        payment["amount"],
        invoices
    )

    if result["status"] == "matched":
        return {
            "decision": "Payment matched",
            "confidence": 1.00,
            "reason": "The payment exactly matches the invoice total.",
            "candidates": result["candidates"]
        }

    if result["status"] == "near_match":
        ai_analysis = ai_analyze_payment(
            payment,
            result["candidates"]
        )

        return {
            "decision": "Payment requires review",
            "confidence": 0.70,
            "reason": "The payment is close to one or more invoice totals.",
            "candidates": result["candidates"],
            "ai_analysis": ai_analysis
        }

    return {
        "decision": "No plausible invoice match",
        "confidence": 0.95,
        "reason": "The payment does not fall within the matching tolerance.",
        "candidates": []
    }