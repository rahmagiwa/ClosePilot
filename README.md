# ClosePilot

ClosePilot is a financial automation platform designed to simplify the month end close process. It brings together financial data from different sources, identifies and reconciles transactions, detects duplicates, verifies payouts, and provides a centralized view of the close process.

## Project Overview

Month end close often requires finance teams to manually collect information from banks, invoices, payment processors, and internal financial systems. ClosePilot is designed to reduce this manual work by automating data ingestion, reconciliation, verification, and reporting.

The system is organized into several major components:

1. Backend
2. Frontend
3. Database
4. Finance and reconciliation logic
5. Tests

## Repository Structure

```text
closepilot/
│
├── backend/
│   ├── reconciliation/
│   │   ├── payment_matching.py
│   │   ├── payout_verification.py
│   │   └── duplicate_detection.py
│   │
│   ├── tests/
│   │   ├── test_payment_matching.py
│   │   ├── test_payout_verification.py
│   │   └── test_duplicate_detection.py
│   │
│   └── README.md
│
├── frontend/
│   └── ...
│
├── database/
│   └── ...
│
├── finance/
│   └── ...
│
├── .gitignore
└── README.md
```

The exact contents of each directory may change as development continues.

## Backend

The backend contains the core business logic used to process and analyze financial data.

### Reconciliation

The `backend/reconciliation/` directory contains the logic responsible for comparing and validating financial records.

### `payment_matching.py`

Matches transactions from different financial sources.

Examples include matching:

```text
Bank transaction → Invoice
Payment processor transaction → Customer payment
Payment → Expected transaction
```

The matching logic can use attributes such as transaction amount, date, identifiers, and other available metadata.

### `payout_verification.py`

Verifies that payouts received from payment processors or other financial systems correspond to expected payout records.

The goal is to identify discrepancies such as:

```text
Expected payout ≠ Actual payout
Missing payout
Incorrect payout amount
Unexpected payout
```

### `duplicate_detection.py`

Identifies potentially duplicated financial transactions.

Duplicate detection can help prevent the same transaction from being counted multiple times during reconciliation.

## Frontend

The frontend will provide the user interface for interacting with ClosePilot.

Planned functionality includes:

```text
Dashboard
Transaction review
Reconciliation results
Duplicate alerts
Payout verification
Close status
Financial summaries
```

The frontend communicates with the backend to retrieve and display financial information.

## Database

The database stores the financial and application data used by ClosePilot.

Potential data includes:

```text
Transactions
Invoices
Payments
Payouts
Customers
Reconciliation results
Duplicate records
Users
```

The database structure should be designed so that financial records can be consistently identified and connected across different sources.

## Finance Logic

The finance component contains calculations and financial rules used by ClosePilot.

Examples include:

```text
Transaction totals
Payout totals
Reconciliation differences
Outstanding amounts
Close status
Financial summaries
```

Financial calculations should be kept separate from the frontend so that the same logic can be reused by different parts of the application.

## Testing

Tests are located in:

```text
backend/tests/
```

The project uses `pytest` for Python backend testing.

### Running all backend tests

From the `backend/` directory:

```bash
python3 -m pytest
```

### Running one test file

For example:

```bash
python3 -m pytest tests/test_duplicate_detection.py
```

### Running a specific test

```bash
python3 -m pytest tests/test_duplicate_detection.py -k duplicate
```

### Running tests with more detailed output

```bash
python3 -m pytest -v
```

## Running Python Files

Python files can be run directly from the terminal.

From the `backend/` directory:

```bash
python3 reconciliation/duplicate_detection.py
```

However, tests should generally be run using `pytest`:

```bash
python3 -m pytest
```

Running tests from the `backend/` directory also ensures that imports such as:

```python
from reconciliation.duplicate_detection import ...
```

resolve correctly.

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd closepilot
```

### 2. Navigate to the backend

```bash
cd backend
```

### 3. Install Python dependencies

If a `requirements.txt` file is present:

```bash
python3 -m pip install -r requirements.txt
```

Otherwise, install the required dependencies individually as they are added to the project.

### 4. Run the tests

```bash
python3 -m pytest
```

## Git Workflow

ClosePilot is being developed collaboratively using Git branches.

The `main` branch should contain the stable version of the project.

Each developer should work on a separate feature branch rather than directly modifying `main`.

Example:

```bash
git checkout -b backend-reconciliation
```

After making changes:

```bash
git add .
git commit -m "Add transaction reconciliation logic"
git push origin backend-reconciliation
```

Changes can then be submitted as a pull request for review and merged into `main`.

## Recommended Branch Organization

Branches should represent meaningful areas of development.

For example:

```text
main
│
├── backend
├── frontend
├── database
└── finance
```

Developers can create additional feature branches when necessary.

Examples:

```text
backend-reconciliation
backend-api
frontend-dashboard
database-schema
finance-calculations
```

## Development Guidelines

### Keep components separated

Backend logic should remain in the backend.

Frontend UI logic should remain in the frontend.

Database configuration and schemas should remain in the database component.

Financial calculations should remain separated from presentation logic whenever possible.

### Write tests for backend logic

New backend functionality should include corresponding tests.

For example:

```text
backend/reconciliation/duplicate_detection.py
backend/tests/test_duplicate_detection.py
```

### Keep functions focused

Functions should generally perform one clearly defined task. This makes the code easier to test, debug, and maintain.

### Use descriptive names

Prefer:

```python
detect_duplicate_transactions()
```

over:

```python
check_data()
```

### Document important logic

Financial rules and reconciliation decisions should be documented because incorrect financial calculations can produce misleading results.

## Current Development Status

ClosePilot is currently under active development.

Current work includes:

```text
Backend reconciliation logic
Payment matching
Payout verification
Duplicate detection
Backend testing
Frontend development
Database development
Financial processing
```

Additional functionality will be added as the project develops.

## Team Development

ClosePilot is a collaborative project. Each component can be developed independently and integrated through the shared repository.

Before making changes:

```bash
git pull
```

Create or switch to the appropriate branch:

```bash
git checkout <branch-name>
```

After completing work:

```bash
git add .
git commit -m "Describe your changes"
git push origin <branch-name>
```

Then open a pull request into the appropriate integration branch or `main`, depending on the team's workflow.

## Future Development

Planned areas of development include:

1. Financial data ingestion
2. Bank transaction processing
3. Invoice processing
4. Payment processor integrations
5. Automated reconciliation
6. Duplicate detection
7. Payout verification
8. Reconciliation dashboards
9. User authentication
10. Close status tracking
11. Reporting and analytics
12. Automated alerts for discrepancies

## License

This project is currently a private development project. Licensing information will be added when determined by the project team.
