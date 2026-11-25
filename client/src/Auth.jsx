
import { useState } from "react";
import { apiRequest } from "./services/api";

function Auth({ onBack, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (isRegister && name.trim().length < 2) {
      setMessage("Please enter a name with at least 2 characters.");
      setIsError(true);
      return;
    }

    if (!email.trim() || !password) {
      setMessage("Please complete all required fields.");
      setIsError(true);
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setMessage("Password must contain 8–72 characters.");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";

      const body = isRegister
        ? {
            name: name.trim(),
            email: email.trim(),
            password,
          }
        : {
            email: email.trim(),
            password,
          };

      const result = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (isRegister) {
        setMessage(
          result.message || "Account created successfully. Please sign in."
        );
        setIsError(false);
        setIsRegister(false);
        setPassword("");
        return;
      }

      if (!result.token || !result.user) {
        throw new Error("Login response is missing your account details.");
      }

      sessionStorage.setItem("formaToken", result.token);

      // Send the logged-in user's details to the Forma dashboard.
      if (onAuthSuccess) {
        onAuthSuccess(result.user);
      } else {
        setMessage(result.message || "Login successful.");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsRegister((previous) => !previous);
    setMessage("");
    setIsError(false);
    setPassword("");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <button
          className="auth-back"
          type="button"
          onClick={onBack}
          disabled={loading}
        >
          ← Back to Forma
        </button>

        <div className="auth-brand">
          <span className="brand-icon">F</span>
          <span>
            Forma<span className="brand-dot">.</span>
          </span>
        </div>

        <span className="eyebrow">
          {isRegister ? "START YOUR JOURNEY" : "WELCOME BACK"}
        </span>

        <h1>
          {isRegister ? "Create your account" : "Sign in to learn"}
        </h1>

        <p className="auth-description">
          {isRegister
            ? "Create an account to begin your learning journey."
            : "Continue learning, practising, and building your skills."}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label className="auth-field">
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                minLength={2}
                maxLength={60}
                required
              />
            </label>
          )}

          <label className="auth-field">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              minLength={8}
              maxLength={72}
              required
            />
          </label>

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account →"
                : "Sign in →"}
          </button>
        </form>

        {message && (
          <p
            className="auth-message"
            role="status"
            style={{
              color: isError ? "#c62828" : "#218838",
            }}
          >
            {message}
          </p>
        )}

        <div className="auth-switch">
          {isRegister
            ? "Already have an account?"
            : "New to Forma?"}{" "}
          <button
            type="button"
            disabled={loading}
            onClick={switchMode}
          >
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </div>

        <p className="auth-notice">
          Your account is connected to the Forma backend.
        </p>
      </section>
    </main>
  );
}

export default Auth;
