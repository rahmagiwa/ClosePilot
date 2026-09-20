import { useState } from "react";

const STATUS_COLORS = {
  anomaly: "#d64545",
  possible: "#e0a83c",
  resolved: "#4f8a5f",
};

export default function Dashboard({
  monthLabel,
  status,
  progressPercent,
  transactionsReviewed,
  matched,
  needReview,
  summaryText,
  anomalyCount,
  possibleCount,
  resolvedCount,
  items,
  cashFlowData,
  onBack,
  onLogout,
  onAskAssistant,
}) {
  const [question, setQuestion] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
const [assistantAnswer, setAssistantAnswer] = useState("");
const [assistantLoading, setAssistantLoading] = useState(false);
const [selectedReview, setSelectedReview] = useState(null);
  async function handleAsk() {
  if (!question.trim()) return;

  setAssistantLoading(true);
  setAssistantAnswer("");

  try {
    const answer = await onAskAssistant?.(
      question.trim()
    );

    setAssistantAnswer(
      answer ||
        "I could not find an answer for that question."
    );
  } catch {
    setAssistantAnswer(
      "I could not answer that question right now."
    );
  } finally {
    setAssistantLoading(false);
    setQuestion("");
  }
}

  return (
    <div className="dash-page">
      <style>{`
        .dash-page {
          --navy: #0a1628;
          --text: #16233a;
          --muted: #68768d;
          --border: #dce3ee;
          --white: #ffffff;
          --sage: #5f7f5c;
          --sage-dark: #52704f;
          --sage-pale: #e6f2e6;
          --red: #d64545;
          --amber: #e0a83c;
          --green: #4f8a5f;

          min-height: 100vh;
          padding: 32px clamp(16px, 4vw, 48px) 60px;
          background:
            radial-gradient(
              circle at 85% 0%,
              rgba(190, 193, 150, 0.35),
              transparent 40%
            ),
            radial-gradient(
              circle at 0% 100%,
              rgba(190, 193, 150, 0.25),
              transparent 35%
            ),
            #f3efd6;
          font-family: "Manrope", -apple-system, sans-serif;
          color: var(--text);
          box-sizing: border-box;
        }

        .dash-page * {
          box-sizing: inherit;
        }

        .dash-shell {
          max-width: 980px;
          margin: 0 auto;
        }

        .dash-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .dash-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 4px;
        }

        .dash-back:hover {
          color: var(--navy);
        }

        .dash-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--navy);
          font-family: "DM Mono", monospace;
        }

        .dash-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: "DM Mono", monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 6px 12px;
          border-radius: 999px;
          background: var(--sage-pale);
          color: var(--sage-dark);
        }

        .dash-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--sage-dark);
        }

        .dash-card {
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 18px;
          backdrop-filter: blur(14px) saturate(130%);
          -webkit-backdrop-filter: blur(14px) saturate(130%);
          box-shadow: 0 10px 30px rgba(30, 40, 20, 0.08);
          padding: 26px 28px;
          margin-bottom: 20px;
        }

        .dash-progress-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
          margin: 0 0 14px;
        }

        .dash-progress-track {
          height: 10px;
          border-radius: 999px;
          background: #e9e5c8;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .dash-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            var(--sage),
            var(--sage-dark)
          );
        }

        .dash-progress-stats {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          font-family: "DM Mono", monospace;
          font-size: 12.5px;
          color: var(--muted);
        }

        .dash-progress-stats b {
          color: var(--navy);
          font-weight: 700;
        }

        .dash-progress-pct {
          font-family: "DM Mono", monospace;
          font-weight: 700;
          color: var(--navy);
          float: right;
        }

        .dash-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 760px) {
          .dash-grid {
            grid-template-columns: 1fr;
          }
        }

        .dash-panel-title {
          font-family: "DM Mono", monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.09em;
          color: var(--muted);
          margin: 0 0 18px;
        }

        .dash-chart-wrapper {
  width: 100%;
  overflow: visible;
}

.dash-chart {
  width: 100%;
  height: 220px;
  display: block;
  overflow: visible;
}

.cash-flow-axis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: var(--muted);
  font-family: "DM Mono", monospace;
  font-size: 10px;
}

.cash-flow-y-label {
  font-family: "DM Mono", monospace;
  font-size: 10px;
  fill: var(--muted);
}

.cash-flow-x-label {
  font-family: "DM Mono", monospace;
  font-size: 10px;
  fill: var(--muted);
}

.cash-flow-point {
  cursor: pointer;
  transition: r 0.15s ease;
}

.cash-flow-point:hover {
  r: 6;
}

.cash-flow-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  color: var(--muted);
  font-family: "DM Mono", monospace;
  font-size: 10px;
}

        .dash-summary-quote {
          font-size: 15px;
          line-height: 1.6;
          color: var(--navy);
          font-style: italic;
          margin: 0 0 20px;
          padding-left: 14px;
          border-left: 3px solid var(--sage);
        }

        .dash-summary-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dash-summary-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
        }

        .dash-summary-button {
          width: 100%;
          border: none;
          background: none;
          padding: 4px 0;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }

        .dash-summary-button:hover {
          opacity: 0.7;
        }

        .dash-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dash-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .dash-item-row:last-child {
          border-bottom: none;
        }

        .dash-item-left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .dash-item-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dash-item-title {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--navy);
        }

        .dash-item-refs {
          font-family: "DM Mono", monospace;
          font-size: 12px;
          color: var(--muted);
        }

        .dash-item-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .dash-item-amount {
          font-family: "DM Mono", monospace;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--navy);
          white-space: nowrap;
        }

        .dash-review-btn {
          font-family: "DM Mono", monospace;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--sage-dark);
          color: var(--sage-dark);
          background: var(--sage-pale);
          cursor: pointer;
          white-space: nowrap;
        }

        .dash-review-btn:hover {
          background: var(--sage-dark);
          color: var(--white);
        }

        .dash-empty-state {
          text-align: center;
          padding: 30px 10px;
          color: var(--muted);
          font-size: 14px;
        }

        .dash-assistant-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "DM Mono", monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.09em;
          color: var(--muted);
          margin: 0 0 14px;
        }

        .dash-assistant-row {
          display: flex;
          gap: 10px;
        }

        .dash-assistant-input {
          flex: 1;
          height: 46px;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0 16px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          background: var(--white);
          color: var(--text);
        }

        .dash-assistant-input:focus {
          border-color: var(--sage);
          box-shadow: 0 0 0 3px rgba(95, 127, 92, 0.15);
        }

        .dash-assistant-btn {
          height: 46px;
          padding: 0 20px;
          border: none;
          border-radius: 10px;
          background: var(--sage-dark);
          color: var(--white);
          font-family: "DM Mono", monospace;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
        }

        .dash-assistant-btn:hover {
          background: #446140;
        }

        .dash-topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dash-logout-btn {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.7);
  color: var(--navy);
  border-radius: 8px;
  padding: 7px 12px;
  font-family: "DM Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.dash-logout-btn:hover {
  background: var(--navy);
  color: var(--white);
}

.dash-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 22, 40, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.dash-modal {
  position: relative;
  width: min(560px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  background: var(--white);
  border-radius: 18px;
  padding: 30px;
  box-shadow: 0 24px 70px rgba(10, 22, 40, 0.25);
}

.dash-modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: var(--muted);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.dash-modal-close:hover {
  color: var(--navy);
}

.dash-modal-title {
  margin: 0 0 6px;
  color: var(--navy);
  font-size: 21px;
}

.dash-modal-subtitle {
  margin: 0 0 24px;
  color: var(--muted);
  font-family: "DM Mono", monospace;
  font-size: 12px;
}

.dash-modal-section {
  margin-bottom: 20px;
}

.dash-modal-label {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-family: "DM Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.dash-modal-section p {
  margin: 0;
  color: var(--text);
  line-height: 1.6;
  font-size: 14px;
}

.dash-modal-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.dash-modal-row strong {
  color: var(--navy);
  font-family: "DM Mono", monospace;
}

.dash-candidate {
  display: flex;
  justify-content: space-between;
  padding: 11px 13px;
  margin-top: 7px;
  background: #f5f7f1;
  border-radius: 8px;
  font-size: 13px;
}

.dash-candidate strong {
  font-family: "DM Mono", monospace;
}

.dash-modal-action {
  width: 100%;
  margin-top: 8px;
  height: 44px;
  border: none;
  border-radius: 9px;
  background: var(--sage-dark);
  color: var(--white);
  font-family: "DM Mono", monospace;
  font-weight: 700;
  cursor: pointer;
}

.dash-modal-action:hover {
  background: #446140;
}

.dash-assistant-answer {
  margin-top: 16px;
  padding: 16px 18px;
  border-radius: 10px;
  background: #f5f7f1;
  border: 1px solid var(--border);
}

.dash-assistant-answer-label {
  display: block;
  margin-bottom: 7px;
  color: var(--sage-dark);
  font-family: "DM Mono", monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.dash-assistant-answer p {
  margin: 0;
  color: var(--text);
  font-size: 14px;
  line-height: 1.6;
}
      `}</style>

      <div className="dash-shell">
        <div className="dash-topbar">
  <button className="dash-back" onClick={onBack}>
    &larr; Months
  </button>

  <span className="dash-title">
    {monthLabel.toUpperCase()} CLOSE
  </span>

  <div className="dash-topbar-right">
    <span className="dash-status">
      <span className="dash-status-dot" />
      {status}
    </span>

    <button
      className="dash-logout-btn"
      onClick={onLogout}
    >
      Logout
    </button>
  </div>
</div>

        <div className="dash-card">
          <p className="dash-progress-label">
            Close Progress
            <span className="dash-progress-pct">
              {progressPercent}%
            </span>
          </p>

          <div className="dash-progress-track">
            <div
              className="dash-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="dash-progress-stats">
            <span>
              <b>{transactionsReviewed}</b> transactions reviewed
            </span>

            <span>
              <b>{matched}</b> matched
            </span>

            <span>
              <b>{needReview}</b> need review
            </span>
          </div>
        </div>

        <div className="dash-grid">
          <div className="dash-card">
            <p className="dash-panel-title">
              CASH / RECONCILIATION
            </p>

            <div className="dash-cash-flow">
  {cashFlowData?.length ? (
    <>
      <div className="cash-flow-axis">
        <span>Net cash flow</span>

        <span>
          {cashFlowData.length} data points
        </span>
      </div>

      <div className="dash-chart-wrapper">
        <svg
          className="dash-chart"
          viewBox="0 0 700 240"
          preserveAspectRatio="none"
        >
          {(() => {
            const values = cashFlowData.map(
              (point) => Number(point.amount) || 0
            );

            const maxValue = Math.max(...values, 0);
            const minValue = Math.min(...values, 0);

            const range =
              maxValue - minValue || 1;

            const width = 700;
            const height = 180;

            const leftPadding = 55;
            const rightPadding = 10;
            const topPadding = 10;
            const bottomPadding = 30;

            const chartWidth =
              width - leftPadding - rightPadding;

            const chartHeight =
              height - topPadding - bottomPadding;

            const getX = (index) => {
              if (cashFlowData.length === 1) {
                return leftPadding + chartWidth / 2;
              }

              return (
                leftPadding +
                (index /
                  (cashFlowData.length - 1)) *
                  chartWidth
              );
            };

            const getY = (amount) => {
              return (
                topPadding +
                ((maxValue - amount) / range) *
                  chartHeight
              );
            };

            const points = cashFlowData
              .map((point, index) => {
                return `${getX(index)},${getY(
                  Number(point.amount) || 0
                )}`;
              })
              .join(" ");

            const tickValues = [
              maxValue,
              maxValue * 0.5,
              0,
              minValue * 0.5,
              minValue,
            ];

            const formatMoney = (value) => {
              const number = Number(value) || 0;

              const sign =
                number < 0 ? "-" : "";

              return `${sign}$${Math.abs(
                number
              ).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}`;
            };

            return (
              <>
                {tickValues.map(
                  (tick, index) => {
                    const y = getY(tick);

                    return (
                      <g key={`tick-${index}`}>
                        <line
                          x1={leftPadding}
                          y1={y}
                          x2={width}
                          y2={y}
                          stroke={
                            tick === 0
                              ? "#b8c2d0"
                              : "#e5e9ef"
                          }
                          strokeWidth={
                            tick === 0 ? 1.5 : 1
                          }
                        />

                        <text
                          x={leftPadding - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="cash-flow-y-label"
                        >
                          {formatMoney(tick)}
                        </text>
                      </g>
                    );
                  }
                )}

                <polyline
                  points={points}
                  fill="none"
                  stroke="#52704f"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {cashFlowData.map(
                  (point, index) => {
                    const amount =
                      Number(point.amount) || 0;

                    const x = getX(index);
                    const y = getY(amount);

                    const date = new Date(
                      `${point.date}T00:00:00`
                    );

                    const formattedDate =
                      Number.isNaN(
                        date.getTime()
                      )
                        ? point.date
                        : date.toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          );

                    return (
                      <g key={`${point.date}-${index}`}>
                        <circle
                          className="cash-flow-point"
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#52704f"
                          stroke="white"
                          strokeWidth="2"
                        >
                          <title>
                            {formattedDate}
                            {"\n"}
                            Net cash flow:{" "}
                            {amount < 0
                              ? "-"
                              : ""}
                            $
                            {Math.abs(
                              amount
                            ).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </title>
                        </circle>
                      </g>
                    );
                  }
                )}

                {cashFlowData.length > 0 && (
                  <>
                    <text
                      x={leftPadding}
                      y={height - 4}
                      textAnchor="start"
                      className="cash-flow-x-label"
                    >
                      {cashFlowData[0].date}
                    </text>

                    {cashFlowData.length > 1 && (
                      <text
                        x={width}
                        y={height - 4}
                        textAnchor="end"
                        className="cash-flow-x-label"
                      >
                        {
                          cashFlowData[
                            cashFlowData.length - 1
                          ].date
                        }
                      </text>
                    )}
                  </>
                )}
              </>
            );
          })()}
        </svg>
      </div>

      <div className="cash-flow-labels">
        <span>
          Positive = net cash in
        </span>

        <span>
          Negative = net cash out
        </span>
      </div>
    </>
  ) : (
    <p className="dash-empty-state">
      No cash flow data is available
      for this period.
    </p>
  )}
</div>
          </div>

          <div className="dash-card">
            <p className="dash-panel-title">
              AI CLOSE SUMMARY
            </p>

            <p className="dash-summary-quote">
              &ldquo;{summaryText}&rdquo;
            </p>

            <div className="dash-summary-list">
              <button
                className="dash-summary-row dash-summary-button"
                onClick={() => setSelectedSection("anomalies")}
              >
                <span
                  className="dash-dot"
                  style={{
                    background: STATUS_COLORS.anomaly,
                  }}
                />

                {anomalyCount} anomalies
              </button>

              <button
                className="dash-summary-row dash-summary-button"
                onClick={() => setSelectedSection("possible")}
              >
                <span
                  className="dash-dot"
                  style={{
                    background: STATUS_COLORS.possible,
                  }}
                />

                {possibleCount} possible matches
              </button>

              <button
                className="dash-summary-row dash-summary-button"
                onClick={() => setSelectedSection("resolved")}
              >
                <span
                  className="dash-dot"
                  style={{
                    background: STATUS_COLORS.resolved,
                  }}
                />

                {resolvedCount} resolved
              </button>
            </div>
          </div>
        </div>

        {selectedSection && (
          <div className="dash-card">
            <p className="dash-panel-title">
              {selectedSection.toUpperCase()}
            </p>

            {selectedSection === "anomalies" && (
              <>
                {anomalyCount === 0 ? (
                  <p className="dash-empty-state">
                    No anomalies were found for this period.
                  </p>
                ) : (
                  <div>
                    {items
                      .filter((item) => item.severity === "anomaly")
                      .map((item) => (
                        <div
                          className="dash-item-row"
                          key={item.id}
                        >
                          <div className="dash-item-left">
                            <span
                              className="dash-dot"
                              style={{
                                background:
                                  STATUS_COLORS.anomaly,
                                marginTop: "6px",
                              }}
                            />

                            <div className="dash-item-text">
                              <span className="dash-item-title">
                                {item.title}
                              </span>

                              <span className="dash-item-refs">
                                {item.refs}
                              </span>
                            </div>
                          </div>

                          <span className="dash-item-amount">
                            {item.amount}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}

            {selectedSection === "possible" && (
              <>
                {possibleCount === 0 ? (
                  <p className="dash-empty-state">
                    No possible matches require review.
                  </p>
                ) : (
                  <div>
                    {items
                      .filter((item) => item.severity === "possible")
                      .map((item) => (
                        <div
                          className="dash-item-row"
                          key={item.id}
                        >
                          <div className="dash-item-left">
                            <span
                              className="dash-dot"
                              style={{
                                background:
                                  STATUS_COLORS.possible,
                                marginTop: "6px",
                              }}
                            />

                            <div className="dash-item-text">
                              <span className="dash-item-title">
                                {item.title}
                              </span>

                              <span className="dash-item-refs">
                                {item.refs}
                              </span>
                            </div>
                          </div>

                          <div className="dash-item-right">
                            <span className="dash-item-amount">
                              {item.amount}
                            </span>

                            <button
  className="dash-review-btn"
  onClick={() => setSelectedReview(item)}
>
  Review
</button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}

            {selectedSection === "resolved" && (
              <>
                {resolvedCount === 0 ? (
                  <p className="dash-empty-state">
                    No resolved payments were found.
                  </p>
                ) : (
                  <p className="dash-empty-state">
                    {resolvedCount} payments were successfully matched
                    during this close.
                  </p>
                )}
              </>
            )}

            <button
              className="dash-review-btn"
              style={{ marginTop: "16px" }}
              onClick={() => setSelectedSection(null)}
            >
              Close details
            </button>
          </div>
        )}

        <div className="dash-card">
          <p className="dash-panel-title">
            ITEMS REQUIRING REVIEW
          </p>

          {items.length === 0 ? (
            <p className="dash-empty-state">
              No open items. This period is fully reconciled.
            </p>
          ) : (
            items.map((item) => (
              <div className="dash-item-row" key={item.id}>
                <div className="dash-item-left">
                  <span
                    className="dash-dot"
                    style={{
                      background: STATUS_COLORS[item.severity],
                      marginTop: "6px",
                    }}
                  />

                  <div className="dash-item-text">
                    <span className="dash-item-title">
                      {item.title}
                    </span>

                    <span className="dash-item-refs">
                      {item.refs}
                    </span>
                  </div>
                </div>

                <div className="dash-item-right">
                  <span className="dash-item-amount">
                    {item.amount}
                  </span>

                  <button
                    className="dash-review-btn"
                    onClick={() => setSelectedReview(item)}
                  >
                    Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="dash-card">
          <p className="dash-assistant-label">
            AI ASSISTANT
          </p>

          <div className="dash-assistant-row">
            <input
              className="dash-assistant-input"
              placeholder="Ask about this month's close..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleAsk()
              }
            />

            <button
              className="dash-assistant-btn"
              onClick={handleAsk}
            >
              Ask ClosePilot
            </button>
          </div>
          {assistantLoading && (
  <div className="dash-assistant-answer">
    <span className="dash-assistant-answer-label">
      CLOSEPILOT
    </span>

    <p>
      Analyzing the September close...
    </p>
  </div>
)}

{assistantAnswer && !assistantLoading && (
  <div className="dash-assistant-answer">
    <span className="dash-assistant-answer-label">
      CLOSEPILOT
    </span>

    <p>
      {assistantAnswer}
    </p>
  </div>
)}
        </div>
      </div>
      {selectedReview && (
  <div
    className="dash-modal-overlay"
    onClick={() => setSelectedReview(null)}
  >
    <div
      className="dash-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="dash-modal-close"
        onClick={() => setSelectedReview(null)}
        aria-label="Close"
      >
        &times;
      </button>

      <p className="dash-panel-title">
        REVIEW EXCEPTION
      </p>

      <h2 className="dash-modal-title">
        {selectedReview.title}
      </h2>

      <p className="dash-modal-subtitle">
        Transaction {selectedReview.refs}
      </p>

      <div className="dash-modal-section">
        <span className="dash-modal-label">
          What is wrong
        </span>

        <p>
          This payment could not be confidently
          matched to a single customer invoice.
          ClosePilot found multiple plausible
          invoices, so the payment needs human
          review before it can be resolved.
        </p>
      </div>

      {selectedReview.details?.amount !==
        undefined && (
        <div className="dash-modal-row">
          <span>Payment amount</span>

          <strong>
            $
            {selectedReview.details.amount.toFixed(
              2
            )}
          </strong>
        </div>
      )}

      {selectedReview.details?.difference !==
        undefined && (
        <div className="dash-modal-row">
          <span>Difference</span>

          <strong>
            $
            {Math.abs(
              selectedReview.details.difference
            ).toFixed(2)}
          </strong>
        </div>
      )}

      {selectedReview.details?.confidence !==
        undefined && (
        <div className="dash-modal-row">
          <span>Match confidence</span>

          <strong>
            {Math.round(
              selectedReview.details.confidence *
                100
            )}
            %
          </strong>
        </div>
      )}

      {selectedReview.details?.candidates
        ?.length > 0 && (
        <div className="dash-modal-section">
          <span className="dash-modal-label">
            Possible invoices
          </span>

          {selectedReview.details.candidates.map(
            (candidate, index) => (
              <div
                className="dash-candidate"
                key={index}
              >
                <span>
                  {candidate.invoice_id ||
                    candidate.invoice ||
                    candidate.id ||
                    "Invoice"}
                </span>

                <strong>
                  $
                  {Number(
                    candidate.amount || 0
                  ).toFixed(2)}
                </strong>
              </div>
            )
          )}
        </div>
      )}

      <button
        className="dash-modal-action"
        onClick={() => setSelectedReview(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}