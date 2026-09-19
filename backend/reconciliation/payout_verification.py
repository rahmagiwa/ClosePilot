def verify_payout(gross_amount, fees, refunds, net_amount, tolerance=0.00):
    """
    Verify that a Stripe payout's net amount is mathematically correct.

    Formula:
        gross amount - fees - refunds = net amount

    Args:
        gross_amount: Total Stripe payment amount.
        fees: Stripe processing fees.
        refunds: Total refunds.
        net_amount: Amount actually paid out.
        tolerance: Maximum allowed difference.

    Returns:
        Dictionary containing the verification result.
    """

    gross_amount = round(float(gross_amount), 2)
    fees = round(float(fees), 2)
    refunds = round(float(refunds), 2)
    net_amount = round(float(net_amount), 2)

    calculated_net = round(gross_amount - fees - refunds, 2)
    difference = round(net_amount - calculated_net, 2)

    if abs(difference) <= tolerance:
        status = "valid"
    else:
        status = "mismatch"

    return {
        "status": status,
        "gross_amount": gross_amount,
        "fees": fees,
        "refunds": refunds,
        "expected_net": calculated_net,
        "actual_net": net_amount,
        "difference": difference,
    }


if __name__ == "__main__":
    # AcmeCloud PO001
    result = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=0.00,
        net_amount=3875.00,
    )

    print(result)

    # Example of an incorrect payout
    result = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=0.00,
        net_amount=3850.00,
    )

    print(result)