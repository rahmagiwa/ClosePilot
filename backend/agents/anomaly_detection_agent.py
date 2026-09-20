def analyze_anomaly(transaction, duplicate_result):
    if duplicate_result.get("is_duplicate"):
        return {
            "decision": "Potential duplicate detected",
            "confidence": 0.95,
            "reason": "The transaction appears to duplicate another transaction."
        }

    if transaction.get("amount", 0) < 0:
        return {
            "decision": "Transaction requires review",
            "confidence": 0.70,
            "reason": "The transaction contains an unexpected negative amount."
        }

    return {
        "decision": "No obvious anomaly",
        "confidence": 0.80,
        "reason": "The transaction does not match the provided anomaly rules."
    }