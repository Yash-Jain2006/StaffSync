import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import LeaveApplications from "../components/manager/LeaveApplications";
import TrainingManagement from "../components/manager/TrainingManagement";
import Logo from "../components/ui/Logo";

export default function ManagerDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("leaves"); // "leaves" | "trainings"

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="portal-layout">
      {/* Topbar */}
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

      {/* Main Content Area */}
      <main className="portal-main">
        <div className="manager-dashboard-card">
          <h1 className="manager-welcome-title">Welcome Back, Manager</h1>

          {/* Segmented Control / Toggle Tabs */}
          <div className="manager-tabs-control">
            <button
              className={`manager-toggle-btn ${activeTab === "leaves" ? "active" : ""}`}
              onClick={() => setActiveTab("leaves")}
            >
              Leave Applications
            </button>
            <button
              className={`manager-toggle-btn ${activeTab === "trainings" ? "active active-green" : ""}`}
              onClick={() => setActiveTab("trainings")}
            >
              Training &amp; Development
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="manager-tab-content">
            {activeTab === "leaves" ? <LeaveApplications /> : <TrainingManagement />}
          </div>
        </div>
      </main>
    </div>
  );
}
