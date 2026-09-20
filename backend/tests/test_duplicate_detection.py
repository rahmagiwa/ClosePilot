from reconciliation.duplicate_detection import (
    are_duplicates,
    find_duplicate_bills,
)


def test_identical_bills_are_duplicates():
    bill1 = {
        "bill_id": "BILL001",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-03",
        "amount": "1450.00",
    }

    bill2 = {
        "bill_id": "BILL005",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-03",
        "amount": "1450.00",
    }

    assert are_duplicates(bill1, bill2) is True


def test_different_amounts_are_not_duplicates():
    bill1 = {
        "bill_id": "BILL001",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-03",
        "amount": "1450.00",
    }

    bill2 = {
        "bill_id": "BILL002",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-03",
        "amount": "1200.00",
    }

    assert are_duplicates(bill1, bill2) is False


def test_different_dates_are_not_duplicates():
    bill1 = {
        "bill_id": "BILL001",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-03",
        "amount": "1450.00",
    }

    bill2 = {
        "bill_id": "BILL002",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-04",
        "amount": "1450.00",
    }

    assert are_duplicates(bill1, bill2) is False


def test_vendor_capitalization_does_not_matter():
    bill1 = {
        "bill_id": "BILL001",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-03",
        "amount": "1450.00",
    }

    bill2 = {
        "bill_id": "BILL005",
        "vendor": "cloudpeak technologies",
        "bill_date": "2026-08-03",
        "amount": "1450.00",
    }

    assert are_duplicates(bill1, bill2) is True


def test_find_duplicate_bills():
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

    assert len(duplicates) == 1
    assert duplicates[0]["bill1"] == "BILL001"
    assert duplicates[0]["bill2"] == "BILL005"
    assert duplicates[0]["amount"] == 1450.00


def test_similar_vendor_names_are_not_exact_duplicates():
    bill1 = {
        "bill_id": "BILL001",
        "vendor": "CloudPeak Technologies",
        "bill_date": "2026-08-03",
        "amount": "1450.00",
    }

    bill2 = {
        "bill_id": "BILL004",
        "vendor": "Cloud Peak Technology",
        "bill_date": "2026-08-15",
        "amount": "1450.00",
    }

    assert are_duplicates(bill1, bill2) is False