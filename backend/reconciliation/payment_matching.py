def match_payment(payment_amount, invoice_amounts, tolerance=0.00):
    """
    Compare a payment amount against the total of one or more invoices.

    Args:
        payment_amount: Amount received from the bank transaction.
        invoice_amounts: List of invoice amounts being considered.
        tolerance: Maximum allowed difference for a near match.

    Returns:
        Dictionary containing the matching status and difference.
    """

    payment_amount = round(float(payment_amount), 2)
    total_invoices = round(sum(float(amount) for amount in invoice_amounts), 2)

    difference = round(payment_amount - total_invoices, 2)
    absolute_difference = abs(difference)

    if absolute_difference == 0:
        status = "matched"
    elif absolute_difference <= tolerance:
        status = "near_match"
    else:
        status = "mismatch"

    return {
        "status": status,
        "payment_amount": payment_amount,
        "invoice_total": total_invoices,
        "difference": difference,
    }


def find_matching_invoices(payment_amount, invoices, tolerance=0.00):
    """
    Find combinations of invoices whose total matches a payment.

    Args:
        payment_amount: Bank payment amount.
        invoices: List of invoice dictionaries.
        tolerance: Maximum allowed difference.

    Returns:
        List of matching invoice combinations.
    """

    matches = []

    def search(start_index, selected_invoices, current_total):
        current_total = round(current_total, 2)
        difference = round(payment_amount - current_total, 2)

        if abs(difference) <= tolerance and selected_invoices:
            matches.append(
                {
                    "invoice_ids": [
                        invoice["invoice_id"] for invoice in selected_invoices
                    ],
                    "invoice_total": current_total,
                    "payment_amount": round(payment_amount, 2),
                    "difference": difference,
                }
            )
            return

        if current_total > payment_amount + tolerance:
            return

        for i in range(start_index, len(invoices)):
            invoice = invoices[i]
            amount = float(invoice["amount"])

            search(
                i + 1,
                selected_invoices + [invoice],
                current_total + amount,
            )

    search(0, [], 0)

    return matches


if __name__ == "__main__":
    # Exact match
    result = match_payment(2500.00, [2500.00])
    print(result)

    # $20 mismatch
    result = match_payment(2480.00, [2500.00])
    print(result)

    # Multiple invoices adding up to one payment
    result = match_payment(2500.00, [1000.00, 1500.00])
    print(result)