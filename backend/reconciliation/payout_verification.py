from decimal import Decimal, InvalidOperation


def to_money(value):
    """Convert a money value into a Decimal rounded to two places."""
    try:
        return Decimal(str(value)).quantize(Decimal("0.01"))
    except (InvalidOperation, ValueError, TypeError) as error:
        raise ValueError(f"Invalid money amount: {value}") from error


def verify_payout(
    gross_amount,
    fees,
    refunds,
    net_amount,
    tolerance="0.00",
):
    """
    Verify that a Stripe payout's net amount is mathematically correct.

    Formula:
        gross amount - fees - refunds = net amount

    Args:
        gross_amount: Total customer payments collected by Stripe.
        fees: Stripe processing fees.
        refunds: Refunds deducted from the payout.
        net_amount: Net amount reported by Stripe.
        tolerance: Allowed difference before marking a mismatch.

    Returns:
        A structured reconciliation result. This function only verifies
        payout math; it does not yet match the Stripe payout to a bank
        transaction or general-ledger entry.
    """
    gross_amount = to_money(gross_amount)
    fees = to_money(fees)
    refunds = to_money(refunds)
    net_amount = to_money(net_amount)
    tolerance = to_money(tolerance)

    expected_net = gross_amount - fees - refunds
    difference = net_amount - expected_net

    if abs(difference) <= tolerance:
        status = "valid"
        review_required = False
        reason = "stripe_payout_math_verified"
    else:
        status = "mismatch"
        review_required = True
        reason = "stripe_payout_math_difference"

    return {
        "status": status,
        "review_required": review_required,
        "reason": reason,
        "gross_amount": float(gross_amount),
        "fees": float(fees),
        "refunds": float(refunds),
        "expected_net": float(expected_net),
        "actual_net": float(net_amount),
        "difference": float(difference),
    }


if __name__ == "__main__":
    valid_payout = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=0.00,
        net_amount=3875.00,
    )
    print(valid_payout)

    refund_payout = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=100.00,
        net_amount=3775.00,
    )
    print(refund_payout)

    invalid_payout = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=0.00,
        net_amount=3850.00,
    )
    print(invalid_payout)