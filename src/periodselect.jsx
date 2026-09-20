const PERIODS = [
  {
    id: "aug-2026",
    label: "August 2026",
    meta: "Closed \u00b7 locked Sept 3",
    status: "closed",
    statusLabel: "Closed",
    clickable: true,
  },
  {
    id: "sep-2026",
    label: "September 2026",
    meta: "5 exceptions found \u00b7 not yet started",
    status: "ready",
    statusLabel: "Ready",
    clickable: true,
  },
  {
    id: "oct-2026",
    label: "October 2026",
    meta: "Data not yet available",
    status: "pending",
    statusLabel: "Not started",
    clickable: false,
  },
];

export default function PeriodSelect({
  onSelect,
  onLogout,
}) {
  function handleSelect(period) {
    if (!period.clickable) return;
    onSelect(period);
  }

  return (
    <main className="period-page">
      <style>{`
        .period-page {
          --navy: #0a1628;
          --blue: #1e6dfb;
          --text: #16233a;
          --muted: #68768d;
          --border: #dce3ee;
          --white: #ffffff;
          --sage: #5f7f5c;
          --sage-dark: #52704f;

          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 40px 20px;
          overflow: hidden;
          font-family: "Manrope", -apple-system, sans-serif;
          color: var(--text);

          background:
            radial-gradient(circle at 75% 22%, rgba(190, 193, 150, 1.0), transparent 33%),
            radial-gradient(circle at 19% 83%, rgba(190, 193, 150, 1.0), transparent 28%),
            linear-gradient(135deg, #52704f, #5f7f5c);
        }
        .period-page * { box-sizing: border-box; }

        .period-page::before,
        .period-page::after {
          position: absolute;
          border: 1px solid rgba(95, 127, 92, 1.0);
          border-radius: 999px;
          content: "";
          z-index: 0;
        }
        .period-page::before {
          width: 550px;
          height: 550px;
          top: -240px;
          right: -170px;
        }
        .period-page::after {
          width: 380px;
          height: 380px;
          bottom: -175px;
          left: -110px;
        }

        .period-card {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 490px;
          flex-direction: column;
          justify-content: center;
          padding: 48px 40px;

          background: rgba(190, 193, 131, 0.32);
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 24px;
          backdrop-filter: blur(18px) saturate(135%);
          -webkit-backdrop-filter: blur(18px) saturate(135%);
          box-shadow:
            0 18px 50px rgba(20, 30, 15, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
        }

        .period-brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 44px;
        }
        .period-brand-mark {
          display: flex;
          width: 42px;
          height: 42px;
          place-items: center;
          overflow: hidden;
          border-radius: 12px;
          background: transparent;
        }
        .period-brand-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .period-brand-row h1 {
          margin: 0;
          color: var(--navy);
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .period-eyebrow {
          margin: 0 0 14px;
          color: var(--blue);
          font-family: "DM Mono", monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.11em;
        }

        .period-heading {
          margin: 0 0 10px;
          color: var(--navy);
          font-size: clamp(28px, 4vw, 38px);
          letter-spacing: -1.4px;
          line-height: 1.1;
        }
        .period-subtext {
          margin: 0 0 32px;
          color: var(--muted);
          font-size: 15px;
        }

        .period-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .period-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 18px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .period-row:hover:not(.period-row--disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
        .period-row--disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .period-row-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .period-row-label {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--navy);
        }
        .period-row-meta {
          font-size: 12.5px;
          color: var(--muted);
        }

        .period-status {
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
          padding: 6px 12px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .period-status--ready {
          background: #e6f2e6;
          color: var(--sage-dark);
        }
        .period-status--closed {
          background: #eef1f5;
          color: var(--muted);
        }
        .period-status--pending {
          background: #f2efe0;
          color: #a39b6e;
        }

        .period-signed-in {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          color: var(--muted);
          font-size: 12px;
        }
        .period-signed-in code {
          color: #33425a;
          font-family: "DM Mono", monospace;
          font-size: 12px;
        }

        .period-logout-btn {
  border: 1px solid #dce3ee;
  background: rgba(255, 255, 255, 0.7);
  color: #0a1628;
  border-radius: 8px;
  padding: 8px 14px;
  font-family: "DM Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  position: fixed;
  top: 24px;
  right: 28px;
}

.period-logout-btn:hover {
  background: #0a1628;
  color: white;
}
      `}</style>
      <button
  className="period-logout-btn"
  onClick={onLogout}
>
  Logout
</button>
      <section className="period-card" aria-labelledby="period-title">
        <div className="period-brand-row">
          <div className="period-brand-mark">
            <img src="/4.png" alt="" />
          </div>
          <div>
            <h1 id="period-title">ClosePilot</h1>
          </div>
        </div>

        <p className="period-eyebrow">ACMECLOUD &middot; WORKSPACE</p>
        <h2 className="period-heading">Choose a close period</h2>
        <p className="period-subtext">Pick which month you&rsquo;d like to run.</p>

        <div className="period-list">
          {PERIODS.map((period) => (
            <button
              key={period.id}
              className={`period-row ${period.clickable ? "" : "period-row--disabled"}`}
              onClick={() => handleSelect(period)}
              disabled={!period.clickable}
            >
              <div className="period-row-text">
                <span className="period-row-label">{period.label}</span>
                <span className="period-row-meta">{period.meta}</span>
              </div>
              <span className={`period-status period-status--${period.status}`}>
                {period.statusLabel}
              </span>
            </button>
          ))}
        </div>

        <div className="period-signed-in">
          <span>Signed in as</span>
          <code>controller@acmecloud.com</code>
        </div>
      </section>
    </main>
  );
}