from backend.ai.client import ask_agent


def analyze_payment(payment, candidate_invoices):
    system_prompt = """
You are the Receivables Agent for a finance automation system.

Your job is to analyze a customer payment that could not be
automatically matched to an invoice.

Review the payment and candidate invoices provided.

Explain:
1. Which invoice is the most likely match
2. Why it is the most likely match
3. Any discrepancy between the payment and invoice
4. Whether a human should review the match

Do not invent financial information that is not provided.
Keep the response concise and factual.
"""

    data = {
        "payment": payment,
        "candidate_invoices": candidate_invoices,
    }

    return ask_agent(system_prompt, data)