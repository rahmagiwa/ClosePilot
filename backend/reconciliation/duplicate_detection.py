def are_duplicates(bill1, bill2):
    """
    Determine whether two bills are exact duplicates.

    Bills are considered duplicates when they have:
    1. The same vendor name
    2. The same amount
    3. The same bill date

    Vendor capitalization and surrounding whitespace are ignored.
    """

    vendor1 = bill1["vendor"].strip().lower()
    vendor2 = bill2["vendor"].strip().lower()

    amount1 = round(float(bill1["amount"]), 2)
    amount2 = round(float(bill2["amount"]), 2)

    date1 = bill1["bill_date"]
    date2 = bill2["bill_date"]

    return (
        vendor1 == vendor2
        and amount1 == amount2
        and date1 == date2
    )


def find_duplicate_bills(bills):
    """
    Find potential duplicate bills.

    Args:
        bills: List of bill dictionaries.

    Returns:
        List of potential duplicate pairs.
    """

    duplicates = []

    for i in range(len(bills)):
        for j in range(i + 1, len(bills)):
            bill1 = bills[i]
            bill2 = bills[j]

            if are_duplicates(bill1, bill2):
                duplicates.append(
                    {
                        "bill1": bill1["bill_id"],
                        "bill2": bill2["bill_id"],
                        "vendor": bill1["vendor"],
                        "amount": round(float(bill1["amount"]), 2),
                        "reason": "Same vendor, amount, and bill date",
                    }
                )

    return duplicates


if __name__ == "__main__":
    bills = [
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
            "bill_id": "BILL002",
            "vendor": "Office Depot",
            "bill_date": "2026-08-08",
            "amount": "642.18",
        },
    ]

    duplicates = find_duplicate_bills(bills)

    for duplicate in duplicates:
        print(duplicate)