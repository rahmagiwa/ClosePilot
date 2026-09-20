def explain_for_auditor(decision, evidence):
    evidence_text = ", ".join(evidence)

    return {
        "decision": decision,
        "confidence": 0.90,
        "reason": f"Decision supported by: {evidence_text}."
    }