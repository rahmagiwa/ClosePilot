from reconciliation.payment_matching import (
    match_payment,
    find_matching_invoices,
)


def test_exact_payment_match():
    result = match_payment(2500.00, [2500.00])

    assert result["status"] == "matched"
    assert result["difference"] == 0.00

 
def test_payment_near_match():
    result = match_payment(2480.00, [2500.00])

    assert result["status"] == "near_match"
    assert result["difference"] == -20.00


def test_multiple_invoices_match_payment():
    result = match_payment(2500.00, [1000.00, 1500.00])

    assert result["status"] == "matched"
    assert result["difference"] == 0.00


def test_find_matching_invoices():
    invoices = [
        {
            "invoice_id": "INV001",
            "amount": "1000.00",
        },
        {
            "invoice_id": "INV002",
            "amount": "1500.00",
        },
        {
            "invoice_id": "INV003",
            "amount": "500.00",
        },
    ]

    matches = find_matching_invoices(2500.00, invoices)

    assert len(matches) > 0
    assert {"INV001", "INV002"} in [
        set(match["invoice_ids"]) for match in matches
    ]


def test_payment_with_no_matching_invoice():
    result = match_payment(1000.00, [750.00])

    assert result["status"] == "mismatch"
    assert result["difference"] == 250.00