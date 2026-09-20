def forecast_cash(current_cash, expected_inflows, expected_outflows):
    projected_cash = (
        current_cash
        + sum(expected_inflows)
        - sum(expected_outflows)
    )

    return {
        "decision": f"Projected ending cash: ${projected_cash:,.2f}",
        "confidence": 0.80,
        "reason": (
            "Projection is based on current cash plus expected inflows "
            "minus expected outflows."
        )
    }