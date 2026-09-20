import { useState } from "react";
import LoginPage from "./login";
import PeriodSelect from "./periodselect";
import Dashboard from "./dashboard";
import { runClose, askAssistant } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [period, setPeriod] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handlePeriodSelect(selectedPeriod) {
    setPeriod(selectedPeriod);
    setLoading(true);
    setError(null);
    setData(null);

    const monthMap = {
      "aug-2026": "2026-08",
      "sep-2026": "2026-09",
    };

    const month = monthMap[selectedPeriod.id];

    if (!month) {
      setError(`No data configured for ${selectedPeriod.label}`);
      setLoading(false);
      return;
    }

    try {
      console.log("Running close for:", month);

      const results = await runClose(month);

      console.log("Pipeline results:", results);

      const summary = results.summary;

      const transactionsReviewed = summary.total_transactions;
      const matched = summary.matched_payments;

      const needReview =
        summary.payments_needing_review +
        summary.payouts_needing_review +
        summary.duplicate_bills;

      const progressPercent =
        transactionsReviewed > 0
          ? Math.round((matched / transactionsReviewed) * 100)
          : 0;

      const items = [];

      results.payment_reconciliation.forEach((payment) => {
        if (
          payment.result.decision ===
          "Payment requires review"
        ) {
          items.push({
            id: payment.transaction_id,
            severity: "possible",
            title: "Payment requires review",
            refs: payment.transaction_id,
            amount: `$${payment.amount.toFixed(2)}`,

            details: {
              transactionId: payment.transaction_id,
              amount: payment.amount,
              difference: payment.result.difference,
              confidence: payment.result.confidence,
              candidates: payment.result.candidates || [],
              decision: payment.result.decision,
            },
          });
        }

        if (
          payment.result.decision ===
          "No plausible invoice match"
        ) {
          items.push({
            id: payment.transaction_id,
            severity: "anomaly",
            title: "No plausible invoice match",
            refs: payment.transaction_id,
            amount: `$${payment.amount.toFixed(2)}`,

            details: {
              transactionId: payment.transaction_id,
              amount: payment.amount,
              decision: payment.result.decision,
            },
          });
        }
      });

      results.payout_verification.forEach((payout) => {
        if (payout.result.review_required) {
          items.push({
            id: payout.payout_id,
            severity: "anomaly",
            title: "Stripe payout requires review",
            refs: payout.payout_id,
            amount: `$${payout.result.net_amount.toFixed(2)}`,

            details: {
              payoutId: payout.payout_id,
              payoutDate: payout.payout_date,
              result: payout.result,
            },
          });
        }
      });

      results.duplicate_detection.forEach(
        (duplicate, index) => {
          items.push({
            id:
              duplicate.id ||
              `duplicate-${index}`,
            severity: "anomaly",
            title: "Possible duplicate vendor bill",
            refs:
              duplicate.bill_id ||
              "Vendor bill",
            amount: duplicate.amount
              ? `$${duplicate.amount.toFixed(2)}`
              : "",

            details: {
              duplicate,
            },
          });
        }
      );

      /*
       * Build actual daily cash flow from the bank transactions.
       *
       * Income = positive cash flow
       * Expense = negative cash flow
       */
      const cashFlowByDate = {};

      results.data.bank_transactions.forEach(
        (transaction) => {
          const date =
            transaction.date ||
            transaction.transaction_date ||
            transaction.posted_date;

          if (!date) return;

          const amount = Number(transaction.amount) || 0;

          const netAmount =
            transaction.type === "income"
              ? amount
              : -amount;

          if (!cashFlowByDate[date]) {
            cashFlowByDate[date] = 0;
          }

          cashFlowByDate[date] += netAmount;
        }
      );

      const cashFlowData = Object.entries(
        cashFlowByDate
      )
        .sort(([dateA], [dateB]) =>
          dateA.localeCompare(dateB)
        )
        .map(([date, amount]) => ({
          date,
          amount,
        }));

      const transformedData = {
        monthLabel: selectedPeriod.label,
        status: results.status,

        progressPercent,
        transactionsReviewed,
        matched,
        needReview,

        summaryText:
          summary.total_exceptions === 0
            ? "The close is fully reconciled with no exceptions requiring review."
            : `${summary.total_exceptions} exception requires review before the close can be completed.`,

        anomalyCount:
          summary.unmatched_payments +
          summary.payouts_needing_review +
          summary.duplicate_bills,

        possibleCount:
          summary.payments_needing_review,

        resolvedCount:
          summary.matched_payments,

        items,

        cashFlowData,

        rawData: results,
      };

      setData(transformedData);
    } catch (err) {
      console.error(
        "Close pipeline error:",
        err
      );

      setError(
        err.message ||
          "Failed to load close data."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAskAssistant(question) {
    if (!data) return null;

    try {
      const result = await askAssistant(
        question,
        data.rawData
      );

      return result.answer;
    } catch (err) {
      console.error(
        "Assistant error:",
        err
      );

      return (
        err.message ||
        "I could not answer that question."
      );
    }
  }

  function handleBack() {
    setPeriod(null);
    setData(null);
  }

  function handleLogout() {
    setUser(null);
    setPeriod(null);
    setData(null);
    setError(null);
  }

  if (!user) {
    return (
      <LoginPage
        onLogin={setUser}
      />
    );
  }

  if (!period) {
    return (
      <PeriodSelect
        onSelect={handlePeriodSelect}
        onLogout={handleLogout}
      />
    );
  }

  if (loading) {
    return (
      <main>
        <h2>Running month end close...</h2>
        <p>Analyzing financial data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h2>Unable to load close data</h2>

        <p>{error}</p>

        <button onClick={handleBack}>
          Back
        </button>
      </main>
    );
  }

  if (!data) {
    return (
      <div>
        No close data available.
      </div>
    );
  }

  return (
    <Dashboard
      {...data}
      onBack={handleBack}
      onLogout={handleLogout}
      onAskAssistant={handleAskAssistant}
    />
  );
}