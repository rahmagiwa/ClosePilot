# ClosePilot Backend

## Overview

The backend is responsible for processing financial data and running deterministic reconciliation logic.

The first version focuses on simple financial checks that can be performed with regular code. AI agents will be added later for cases that require more ambiguous or contextual reasoning.

## Current Structure

```text
backend/
├── README.md
└── reconciliation/
    ├── payment_matching.py
    ├── payout_verification.py
    └── duplicate_detection.py
```

## Reconciliation

The `reconciliation` folder contains the core financial logic for identifying matches and potential problems in AcmeCloud's financial data.

### `payment_matching.py`

This file compares bank payments against customer invoices.

It handles three possible outcomes:

```text
matched
near_match
mismatch
```

#### Exact Match

If the payment amount equals the total invoice amount:

```text
Payment: $2,500
Invoice: $2,500

Result: matched
Difference: $0
```

#### Multiple Invoice Match

A single payment can correspond to multiple invoices.

For example:

```text
Payment: $2,500
Invoice 1: $1,000
Invoice 2: $1,500

Result: matched
```

#### Mismatch

If the amounts are different:

```text
Payment: $2,480
Invoice: $2,500

Result: mismatch
Difference: -$20
```

The `match_payment()` function performs the basic amount comparison.

The `find_matching_invoices()` function searches for combinations of invoices that add up to a payment.

## `payout_verification.py`

This file verifies Stripe payout calculations.

The expected calculation is:

```text
Gross Amount - Fees - Refunds = Net Amount
```

For example:

```text
Gross: $4,000
Fees: $125
Refunds: $0

Expected Net: $3,875
Actual Net: $3,875

Result: valid
```

If the calculated amount does not match the actual payout, the result is:

```text
mismatch
```

The `verify_payout()` function performs this calculation.

## `duplicate_detection.py`

This file identifies bills that appear to be exact duplicates.

The current deterministic rule checks whether two bills have:

1. The same vendor name
2. The same amount
3. The same bill date

For example:

```text
BILL001
Vendor: CloudPeak Technologies
Amount: $1,450
Date: 2026-08-03

BILL005
Vendor: CloudPeak Technologies
Amount: $1,450
Date: 2026-08-03

Result: Potential duplicate
```

The `are_duplicates()` function compares two bills.

The `find_duplicate_bills()` function checks a list of bills and returns potential duplicate pairs.

## AI Agent Integration

The deterministic backend should handle straightforward cases before involving AI.

For example:

```text
$2,500 = $2,500
        ↓
Backend
        ↓
Exact match
```

For ambiguous cases, the AI agent can be used later.

For example:

```text
CloudPeak Technologies
Cloud Peak Technology
        ↓
Backend sees different names
        ↓
AI Agent
        ↓
Possible same vendor
```

The backend should not use AI to perform basic arithmetic or exact comparisons.

## Expected AcmeCloud Cases

The demo data is designed to test the following:

| Case                                            | Expected Result            |
| ----------------------------------------------- | -------------------------- |
| $2,500 payment and $2,500 invoice               | Exact match                |
| $2,480 payment and $2,500 invoice               | $20 mismatch               |
| $4,000 Stripe payout with $125 fees             | Valid                      |
| BILL001 and BILL005                             | Potential duplicate        |
| CloudPeak Technologies vs Cloud Peak Technology | Ambiguous vendor match for |
