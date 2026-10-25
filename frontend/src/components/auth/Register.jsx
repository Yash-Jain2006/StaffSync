import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth, dashboardPath } from "../../utils/AuthContext";
import { errMsg } from "../../api/client";
import { Alert } from "../ui/ui";
import Logo from "../ui/Logo";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Employee" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await register(form);
      navigate(dashboardPath(u.role));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Back to Home Button */}
        <Link to="/" className="auth-back-link" title="Back to Home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Home</span>
        </Link>

        {/* Logo Emblem */}
        <div className="auth-brand-badge">
          <Logo size={46} showText={false} />
        </div>

        <h2 className="auth-title">StaffSync Register</h2>
        <Alert>{error}</Alert>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="Enter your name"
              value={form.name}
              onChange={set("name")}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={set("email")}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={set("role")}
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={busy}>
            {busy ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
}
