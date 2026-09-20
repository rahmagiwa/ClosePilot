import csv
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "fake"


DATE_COLUMNS = {
    "bank_transactions.csv": "date",
    "customer_invoices.csv": "invoice_date",
    "vendor_bills.csv": "bill_date",
    "stripe_payouts.csv": "payout_date",
    "ledger.csv": "date",
}


def load_csv(filename, month=None):
    """Load a CSV file and optionally filter records by month."""

    path = DATA_DIR / filename

    with open(path, newline="", encoding="utf-8") as file:
        rows = list(csv.DictReader(file))

    if month is not None:
        date_column = DATE_COLUMNS[filename]
        rows = [
            row for row in rows
            if row[date_column].startswith(month)
        ]

    return rows


def load_demo_data(month=None):
    """Load AcmeCloud demo financial data for a specific month."""

    return {
        "bank_transactions": load_csv("bank_transactions.csv", month),
        "customer_invoices": load_csv("customer_invoices.csv", month),
        "vendor_bills": load_csv("vendor_bills.csv", month),
        "stripe_payouts": load_csv("stripe_payouts.csv", month),
        "ledger": load_csv("ledger.csv", month),
    }