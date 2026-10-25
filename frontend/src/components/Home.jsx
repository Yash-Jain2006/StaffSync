import React from "react";
import { Link } from "react-router-dom";
import { useAuth, dashboardPath } from "../utils/AuthContext";
import Logo from "./ui/Logo";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-brand">
            <Logo size={36} />
          </div>
          <div className="landing-actions">
            {user ? (
              <Link to={dashboardPath(user.role)} className="btn-primary">
                Open Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-primary">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <h1 className="hero-title">
            Empower Your Workforce with <span className="hero-highlight">StaffSync</span>
          </h1>
          <p className="hero-subtitle">
            A smart Human Resource Management platform designed to simplify attendance tracking,
            <br />
            leave management, employee records, and communication across teams.
          </p>
          <div className="hero-cta">
            <Link to={user ? dashboardPath(user.role) : "/login"} className="btn-primary btn-lg">
              Get Started
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="landing-features">
          <div className="features-grid">
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrap icon-blue">
                <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Employee Management</h3>
              <p className="feature-desc">
                Manage employee records, roles, and information efficiently.
              </p>
            </div>

            {/* Card 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrap icon-green">
                <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 16l2 2 4-4" />
                </svg>
              </div>
              <h3 className="feature-title">Attendance &amp; Leave</h3>
              <p className="feature-desc">
                Track attendance and handle leave approvals easily.
              </p>
            </div>

            {/* Card 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrap icon-yellow">
                <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-title">HR &amp; Manager Tools</h3>
              <p className="feature-desc">
                Handle team announcements, performance, and training modules.
              </p>
            </div>

            {/* Card 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrap icon-pink">
                <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125v3.375m9 0h1.5a2.25 2.25 0 002.25-2.25V9.75A2.25 2.25 0 0018 7.5h-1.5M7.5 18.75H6a2.25 2.25 0 01-2.25-2.25V9.75A2.25 2.25 0 016 7.5h1.5m9 0V5.25A2.25 2.25 0 0014.25 3h-4.5A2.25 2.25 0 007.5 5.25V7.5m9 0h-9" />
                </svg>
              </div>
              <h3 className="feature-title">Employee Growth</h3>
              <p className="feature-desc">
                Monitor performance and assign development trainings.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 StaffSync — Empowering Teams, Simplifying Workflows.</p>
      </footer>
    </div>
  );
}
