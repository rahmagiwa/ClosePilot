from decimal import Decimal


def to_money(value):
    """Convert a financial value to Decimal."""

    return Decimal(str(value))


def normalize_bank_transaction(transaction):
    """Normalize a bank transaction."""

    return {
        "transaction_id": transaction["transaction_id"],
        "date": transaction["date"],
        "description": transaction["description"],
        "amount": to_money(transaction["amount"]),
        "type": transaction["type"],
    }


def normalize_customer_invoice(invoice):
    """Normalize a customer invoice."""

    return {
        "invoice_id": invoice["invoice_id"],
        "customer": invoice["customer"],
        "invoice_date": invoice["invoice_date"],
        "due_date": invoice["due_date"],
        "amount": to_money(invoice["amount"]),
        "status": invoice["status"],
    }


def normalize_vendor_bill(bill):
    """Normalize a vendor bill."""

    return {
        "bill_id": bill["bill_id"],
        "vendor": bill["vendor"],
        "bill_date": bill["bill_date"],
        "due_date": bill["due_date"],
        "amount": to_money(bill["amount"]),
        "status": bill["status"],
    }


def normalize_stripe_payout(payout):
    """Normalize a Stripe payout."""

    return {
        "payout_id": payout["payout_id"],
        "payout_date": payout["payout_date"],
        "gross_amount": to_money(payout["gross_amount"]),
        "fees": to_money(payout["fees"]),
        "net_amount": to_money(payout["net_amount"]),
        "status": payout["status"],
    }


def normalize_ledger_entry(entry):
    """Normalize a ledger entry."""

    return {
        "entry_id": entry["entry_id"],
        "date": entry["date"],
        "account": entry["account"],
        "description": entry["description"],
        "debit": to_money(entry["debit"]),
        "credit": to_money(entry["credit"]),
        "reference": entry["reference"],
    }


def normalize_demo_data(data):
    """Normalize all AcmeCloud demo data."""

    return {
        "bank_transactions": [
            normalize_bank_transaction(transaction)
            for transaction in data["bank_transactions"]
        ],
        "customer_invoices": [
            normalize_customer_invoice(invoice)
            for invoice in data["customer_invoices"]
        ],
        "vendor_bills": [
            normalize_vendor_bill(bill)
            for bill in data["vendor_bills"]
        ],
        "stripe_payouts": [
            normalize_stripe_payout(payout)
            for payout in data["stripe_payouts"]
        ],
        "ledger": [
            normalize_ledger_entry(entry)
            for entry in data["ledger"]
        ],
    }