def assign_invoice(payment, candidate_invoices):
    if not candidate_invoices:
        return {
            "decision": "No invoice identified",
            "confidence": 0.95,
            "reason": "There are no candidate invoices to evaluate."
        }

    if len(candidate_invoices) == 1:
        invoice = candidate_invoices[0]

        return {
            "decision": f"Invoice {invoice['invoice_id']} is the likely match",
            "confidence": 0.85,
            "reason": "Only one candidate invoice was provided."
        }

    return {
        "decision": "Multiple invoices require review",
        "confidence": 0.50,
        "reason": "Multiple candidate invoices could correspond to the payment."
    }