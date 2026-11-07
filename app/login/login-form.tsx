"use client";

import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = event.currentTarget.elements.namedItem("password") as HTMLInputElement;
    password.value = "";
    setStatus("Account sign-in is not available yet. Please contact Atelier for assistance.");
  }

  return (
    <form className="login-form" onSubmit={signIn} aria-describedby="login-availability">
      <p id="login-availability" className="login-availability">Account access is coming soon.</p>
      <label htmlFor="login-email">Email address</label>
      <input id="login-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required maxLength={254} />
      <label htmlFor="login-password">Password</label>
      <div className="login-password">
        <input id="login-password" name="password" type={showPassword ? "text" : "password"}
          autoComplete="current-password" placeholder="Enter your password" required maxLength={256} />
        <button type="button" className="login-password__toggle" aria-label={showPassword ? "Hide password" : "Show password"}
          aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
            {showPassword && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.2" />}
          </svg>
        </button>
      </div>
      <button className="login-submit" type="submit">Sign in <span aria-hidden="true">↗</span></button>
      <p className="login-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
