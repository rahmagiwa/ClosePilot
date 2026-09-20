// Mock data for each close period. Keyed by the period id used in
// PeriodSelect.jsx ("aug-2026", "sep-2026", "oct-2026").
//
// Your teammate will eventually replace the contents of this file with
// real data fetched from the backend — the Dashboard component itself
// doesn't need to change when that happens.

export const MONTH_DATA = {
  "aug-2026": {
    monthLabel: "August 2026",
    status: "Closed",
    progressPercent: 100,
    transactionsReviewed: 38,
    matched: 38,
    needReview: 0,
    summaryText: "All transactions reconciled. No open items this period.",
    anomalyCount: 0,
    possibleCount: 0,
    resolvedCount: 38,
    items: [],
  },

  "sep-2026": {
    monthLabel: "September 2026",
    status: "Active",
    progressPercent: 78,
    transactionsReviewed: 42,
    matched: 33,
    needReview: 9,
    summaryText: "I found 4 items that need your attention...",
    anomalyCount: 2,
    possibleCount: 2,
    resolvedCount: 33,
    items: [
      {
        id: "1",
        severity: "anomaly",
        title: "Payment mismatch",
        refs: "INV003 / BT009",
        amount: "$20 difference",
      },
      {
        id: "2",
        severity: "possible",
        title: "Possible duplicate bill",
        refs: "BILL001 / BILL005",
        amount: "$1,450",
      },
    ],
  },

  "oct-2026": {
    monthLabel: "October 2026",
    status: "Not started",
    progressPercent: 0,
    transactionsReviewed: 0,
    matched: 0,
    needReview: 0,
    summaryText: "Data not yet available for this period.",
    anomalyCount: 0,
    possibleCount: 0,
    resolvedCount: 0,
    items: [],
  },
};