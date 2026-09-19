"""
backend/reconciliation/payment_matching.py

Compares a bank payment to customer invoices. Plain Python, no AI.

Three outcomes:
  matched     difference is exactly $0
  near_match  difference is non-zero but within `tolerance` -> ambiguous, goes to the
              Receivables Agent along with the ranked candidate invoices
  mismatch    nothing plausible found

Sign convention: difference = payment - invoice_total
  negative -> customer short-paid, positive -> customer overpaid
"""
from decimal import Decimal, ROUND_HALF_UP

# Largest dollar gap that still counts as a "near match". Tune to your demo data.
NEAR_MATCH_TOLERANCE = Decimal("100.00")

# Search depth cap: combinations grow exponentially with the number of invoices.
MAX_INVOICES_PER_PAYMENT = 4


def to_money(value):
    """Convert to Decimal cents. Avoids float errors like 0.1 + 0.2 != 0.3."""
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _classify(difference, tolerance):
    gap = abs(difference)
    if gap == 0:
        return "matched"
    if gap <= tolerance:
        return "near_match"
    return "mismatch"


def match_payment(payment_amount, invoice_amounts, tolerance=NEAR_MATCH_TOLERANCE):
    """
    Compare a payment amount against the total of one or more invoices.

    Args:
        payment_amount: Amount received from the bank transaction.
        invoice_amounts: List of invoice amounts being considered.
        tolerance: Maximum dollar difference that still counts as a near match.

    Returns:
        Dictionary containing the matching status and difference.
    """
    payment_amount = to_money(payment_amount)
    total_invoices = sum((to_money(a) for a in invoice_amounts), Decimal("0.00"))
    difference = payment_amount - total_invoices

    return {
        "status": _classify(difference, to_money(tolerance)),
        "payment_amount": payment_amount,
        "invoice_total": total_invoices,
        "difference": difference,
    }


def find_matching_invoices(
    payment_amount,
    invoices,
    tolerance=NEAR_MATCH_TOLERANCE,
    consumed=(),
    max_invoices=MAX_INVOICES_PER_PAYMENT,
):
    """
    Find combinations of invoices whose total matches (or nearly matches) a payment.

    Args:
        payment_amount: Bank payment amount.
        invoices: List of invoice dictionaries with "invoice_id" and "amount".
        tolerance: Maximum dollar difference for a near match.
        consumed: invoice_ids already used by an earlier payment.
        max_invoices: Most invoices allowed in one combination.

    Returns:
        List of candidate combinations, best first: exact matches (difference 0),
        then near matches ordered by smallest gap. Each has status "matched"
        or "near_match".
    """
    payment = to_money(payment_amount)
    tolerance = to_money(tolerance)
    pool = [i for i in invoices if i["invoice_id"] not in consumed]
    matches = []

    def search(start_index, selected, current_total):
        difference = payment - current_total

        if selected and abs(difference) <= tolerance:
            matches.append(
                {
                    "invoice_ids": [inv["invoice_id"] for inv in selected],
                    "invoice_total": current_total,
                    "payment_amount": payment,
                    "difference": difference,
                    "status": _classify(difference, tolerance),
                }
            )
            if difference == 0:
                return  # adding more invoices to an exact match only adds noise
            # For near matches keep going: a superset might be an exact match
            # (e.g. $2,450 is near, but $2,450 + $50 is exact).

        if current_total > payment + tolerance or len(selected) >= max_invoices:
            return

        for i in range(start_index, len(pool)):
            invoice = pool[i]
            search(i + 1, selected + [invoice], current_total + to_money(invoice["amount"]))

    search(0, [], Decimal("0.00"))

    # Exact matches sort first (difference 0), then smallest gap, then fewest invoices.
    matches.sort(key=lambda m: (abs(m["difference"]), len(m["invoice_ids"])))
    return matches


def resolve_payment(payment_amount, invoices, **kwargs):
    """
    One call for the orchestrator: overall status plus the candidates behind it.

      {"status": "matched",    "candidates": [exact combos]}
      {"status": "near_match", "candidates": [ranked near combos]}  -> Receivables Agent
      {"status": "mismatch",   "candidates": []}                    -> human queue
    """
    matches = find_matching_invoices(payment_amount, invoices, **kwargs)
    if not matches:
        return {"status": "mismatch", "candidates": []}
    if matches[0]["status"] == "matched":
        return {"status": "matched", "candidates": [m for m in matches if m["status"] == "matched"]}
    return {"status": "near_match", "candidates": matches}


if __name__ == "__main__":
    # Exact match
    print(match_payment(2500.00, [2500.00]))

    # $20 short -> near_match (this is the ambiguous case the agent should see)
    print(match_payment(2480.00, [2500.00]))

    # Multiple invoices adding up to one payment
    print(match_payment(2500.00, [1000.00, 1500.00]))

    # Far apart -> mismatch
    print(match_payment(1000.00, [2500.00]))

    # Searching a pool of invoices
    invoices = [
        {"invoice_id": "INV-1", "amount": 1000.00},
        {"invoice_id": "INV-2", "amount": 1500.00},
        {"invoice_id": "INV-3", "amount": 9200.00},
    ]
    print(resolve_payment(2500.00, invoices))
    print(resolve_payment(9150.00, invoices))