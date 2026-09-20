from decimal import Decimal, InvalidOperation


def to_money(value):
    """Convert a value to a two-decimal Decimal for financial comparison."""
    try:
        return Decimal(str(value)).quantize(Decimal("0.01"))
    except (InvalidOperation, ValueError, TypeError) as error:
        raise ValueError(f"Invalid money amount: {value}") from error


def normalize_vendor(vendor):
    """
    Normalize a vendor name for exact duplicate detection.

    This intentionally does not merge words or remove business suffixes.
    For example:
    - "CloudPeak Technologies" matches " cloudpeak technologies "
    - "CloudPeak Technologies" does not match "Cloud Peak Technology"
    """
    return " ".join(vendor.strip().lower().split())


def are_duplicates(bill1, bill2):
    """
    Return True when two bills are exact potential duplicates.

    Exact duplicate requirements:
    - Same vendor name after case/whitespace normalization
    - Same bill date
    - Same monetary amount
    """
    return (
        normalize_vendor(bill1["vendor"]) == normalize_vendor(bill2["vendor"])
        and bill1["bill_date"] == bill2["bill_date"]
        and to_money(bill1["amount"]) == to_money(bill2["amount"])
    )


def find_duplicate_bills(bills):
    """
    Find exact potential duplicate vendor bills.

    This function flags records for human review. It never deletes,
    merges, changes status, or creates accounting entries.
    """
    duplicates = []

    for index, bill1 in enumerate(bills):
        for bill2 in bills[index + 1:]:
            if are_duplicates(bill1, bill2):
                duplicates.append(
                    {
                        "status": "potential_duplicate",
                        "review_required": True,
                        "reason": "same_vendor_amount_and_bill_date",
                        "bill1": bill1["bill_id"],
                        "bill2": bill2["bill_id"],
                        "vendor": bill1["vendor"].strip(),
                        "amount": float(to_money(bill1["amount"])),
                        "bill_date": bill1["bill_date"],
                    }
                )

    return duplicates


if __name__ == "__main__":
    demo_bills = [
        {
            "bill_id": "BILL001",
            "vendor": "CloudPeak Technologies",
            "bill_date": "2026-08-03",
            "amount": "1450.00",
        },
        {
            "bill_id": "BILL005",
            "vendor": "CloudPeak Technologies",
            "bill_date": "2026-08-03",
            "amount": "1450.00",
        },
        {
            "bill_id": "BILL004",
            "vendor": "Cloud Peak Technology",
            "bill_date": "2026-08-15",
            "amount": "1450.00",
        },
    ]

    for duplicate in find_duplicate_bills(demo_bills):
        print(duplicate)