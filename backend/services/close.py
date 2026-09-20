"""
backend/services/close.py

Runs the ClosePilot month-end close pipeline.

Pipeline:
    1. Load raw CSV data for a selected month
    2. Normalize the data
    3. Reconcile customer payments
    4. Verify Stripe payouts
    5. Detect duplicate vendor bills
    6. Return one combined result for the API/frontend

The service does not modify financial records.
"""

from backend.data.loader import load_demo_data
from backend.data.normalizer import normalize_demo_data
from backend.agents.payment_matching_agent import analyze_payment
from backend.reconciliation.payout_verification import verify_payout
from backend.reconciliation.duplicate_detection import find_duplicate_bills


def run_close(month):
    """
    Run the ClosePilot close pipeline for a specific month.

    Args:
        month: Month to process in YYYY-MM format.
               Example: "2026-09"

    Returns:
        A dictionary containing normalized data and
        reconciliation results.
    """

    # ---------------------------------------------------------
    # 1. LOAD DATA
    # ---------------------------------------------------------

    raw_data = load_demo_data(month)

    # ---------------------------------------------------------
    # 2. NORMALIZE DATA
    # ---------------------------------------------------------

    data = normalize_demo_data(raw_data)

    bank_transactions = data["bank_transactions"]
    invoices = data["customer_invoices"]
    payouts = data["stripe_payouts"]
    vendor_bills = data["vendor_bills"]

    # ---------------------------------------------------------
    # 3. RECONCILE CUSTOMER PAYMENTS
    # ---------------------------------------------------------

    payment_results = []

    for transaction in bank_transactions:

        # Only income transactions can be customer payments.
        if transaction["type"] != "income":
            continue

        # Stripe payouts are handled separately.
        if "Stripe Payout" in transaction["description"]:
            continue

        result = analyze_payment(
            {
                "payment_id": transaction["transaction_id"],
                "customer": transaction["description"],
                "amount": transaction["amount"],
            },
            invoices,
        )

        payment_results.append(
            {
                "transaction_id": transaction["transaction_id"],
                "amount": transaction["amount"],
                "result": result,
            }
        )

    # ---------------------------------------------------------
    # 4. VERIFY STRIPE PAYOUTS
    # ---------------------------------------------------------

    payout_results = []

    for payout in payouts:

        result = verify_payout(
            gross_amount=payout["gross_amount"],
            fees=payout["fees"],
            refunds=0.00,
            net_amount=payout["net_amount"],
        )

        payout_results.append(
            {
                "payout_id": payout["payout_id"],
                "payout_date": payout["payout_date"],
                "result": result,
            }
        )

    # ---------------------------------------------------------
    # 5. DETECT DUPLICATE VENDOR BILLS
    # ---------------------------------------------------------

    duplicate_results = find_duplicate_bills(vendor_bills)

    # ---------------------------------------------------------
    # 6. CALCULATE PAYMENT SUMMARY
    # ---------------------------------------------------------

    matched_payments = sum(
        1
        for payment in payment_results
        if payment["result"]["decision"] == "Payment matched"
    )

    payments_needing_review = sum(
        1
        for payment in payment_results
        if payment["result"]["decision"] == "Payment requires review"
    )

    unmatched_payments = sum(
        1
        for payment in payment_results
        if payment["result"]["decision"]
        == "No plausible invoice match"
    )

    # ---------------------------------------------------------
    # 7. CALCULATE PAYOUT SUMMARY
    # ---------------------------------------------------------

    payout_reviews = sum(
        1
        for payout in payout_results
        if payout["result"]["review_required"]
    )

    # ---------------------------------------------------------
    # 8. CALCULATE TOTAL EXCEPTIONS
    # ---------------------------------------------------------

    total_exceptions = (
        payments_needing_review
        + unmatched_payments
        + payout_reviews
        + len(duplicate_results)
    )

    # ---------------------------------------------------------
    # 9. RETURN COMPLETE CLOSE RESULT
    # ---------------------------------------------------------

    return {
        "month": month,
        "status": "completed",

        "summary": {
            "total_transactions": len(bank_transactions),
            "matched_payments": matched_payments,
            "payments_needing_review": payments_needing_review,
            "unmatched_payments": unmatched_payments,
            "payouts_needing_review": payout_reviews,
            "duplicate_bills": len(duplicate_results),
            "total_exceptions": total_exceptions,
        },

        "payment_reconciliation": payment_results,

        "payout_verification": payout_results,

        "duplicate_detection": duplicate_results,

        "data": data,
    }