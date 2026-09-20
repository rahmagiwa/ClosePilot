from decimal import Decimal, ROUND_HALF_UP


NEAR_MATCH_TOLERANCE = Decimal("100.00")
MAX_INVOICES_PER_PAYMENT = 4


def to_money(value):
    return Decimal(str(value)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )


def _classify(difference, tolerance):
    gap = abs(difference)

    if gap == 0:
        return "matched"

    if gap <= tolerance:
        return "near_match"

    return "mismatch"


def match_payment(
    payment_amount,
    invoice_amounts,
    tolerance=NEAR_MATCH_TOLERANCE
):
    payment_amount = to_money(payment_amount)

    total_invoices = sum(
        (to_money(amount) for amount in invoice_amounts),
        Decimal("0.00")
    )

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
    payment = to_money(payment_amount)
    tolerance = to_money(tolerance)

    pool = [
        invoice
        for invoice in invoices
        if invoice["invoice_id"] not in consumed
    ]

    matches = []

    def search(start_index, selected, current_total):
        difference = payment - current_total

        if selected and abs(difference) <= tolerance:
            matches.append({
                "invoice_ids": [
                    invoice["invoice_id"]
                    for invoice in selected
                ],
                "invoice_total": current_total,
                "payment_amount": payment,
                "difference": difference,
                "status": _classify(difference, tolerance),
            })

            if difference == 0:
                return

        if (
            current_total > payment + tolerance
            or len(selected) >= max_invoices
        ):
            return

        for i in range(start_index, len(pool)):
            invoice = pool[i]

            search(
                i + 1,
                selected + [invoice],
                current_total + to_money(invoice["amount"])
            )

    search(0, [], Decimal("0.00"))

    matches.sort(
        key=lambda match: (
            abs(match["difference"]),
            len(match["invoice_ids"])
        )
    )

    return matches


def resolve_payment(payment_amount, invoices, **kwargs):
    matches = find_matching_invoices(
        payment_amount,
        invoices,
        **kwargs
    )

    if not matches:
        return {
            "status": "mismatch",
            "candidates": []
        }

    if matches[0]["status"] == "matched":
        return {
            "status": "matched",
            "candidates": [
                match
                for match in matches
                if match["status"] == "matched"
            ]
        }

    return {
        "status": "near_match",
        "candidates": matches
    }