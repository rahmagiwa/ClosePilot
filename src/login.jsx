import { useState } from "react";
import "./login.css";


export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both your username and password.");
      return;
    }

    setIsLoading(true);

    // Demo login: replace this with a real API request later.
    setTimeout(() => {
      if (username === "demo" && password === "closepilot") {
        onLogin?.({
          username,
          role: "Controller",
        });
      } else {
        setError("Incorrect username or password. Try demo / closepilot.");
      }

      setIsLoading(false);
    }, 700);
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
           <div className="brand-row">
    <div className="brand-mark">
     <img src="/4.png" alt="ClosePilot logo" />
    </div>

    <div>
      <h1 id="login-title">ClosePilot</h1>
    </div>
  </div>
       

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to run your month-end close.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">
            Username:
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isLoading}
            />
          </label>

          <label htmlFor="password">
            Password:
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </label>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in to ClosePilot"}
          </button>
        </form>

        <div className="demo-login">
          <span>Demo login:</span>
          <code>demo / closepilot</code>
        </div>
      </section>

      <aside className="login-panel">
        <div className="panel-content">
          <p className="eyebrow">AI CLOSE ROOM</p>
          <h2>Turn month-end chaos into something much calmer.</h2>
          <p>
            Your books, investigated. Every mismatch explained, every decision on the record.
          </p>

          <div className="feature-list">
            <div>
              <span className="feature-icon">✓</span>
              <p>AI-powered reconciliation</p>
            </div>

            <div>
              <span className="feature-icon">✓</span>
              <p>Customer trained agent</p>
            </div>

            <div>
              <span className="feature-icon">✓</span>
              <p>Evidence trails for every result</p>
            </div>
          </div>
        </div>

        <p className="panel-footer">September close • AcmeCloud</p>
      </aside>
    </main>
  );
}