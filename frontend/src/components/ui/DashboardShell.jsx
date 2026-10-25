import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Logo from "./Logo";

export default function DashboardShell({ title, tabs = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(tabs[0]?.id || "");
  const current = tabs.find((t) => t.id === active) || tabs[0];

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const portalTitle = title.includes("Portal") ? title : `${title} Portal`;

  return (
    <div className="portal-layout">
      <header className="portal-header">
        <div className="portal-header-inner">
          <Logo size={32} />
          <div className="portal-actions">
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="portal-subnav">
        <div className="portal-tabs-container">
          <div className="portal-tabs" role="tablist">
            {tabs.map((t) => {
              const isActive = t.id === current?.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`portal-tab ${isActive ? "active" : ""}`}
                  onClick={() => setActive(t.id)}
                >
                  <span>{t.label}</span>
                  {isActive && <div className="tab-indicator" />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="tabs-divider" />
      </div>

      <main className="portal-main">
        <div className="portal-content-wrap">
          <section role="tabpanel" key={current?.id}>
            {current?.render ? current.render() : null}
          </section>
        </div>
      </main>
    </div>
  );
}
