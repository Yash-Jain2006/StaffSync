import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import LeaveApplications from "../components/hr/LeaveApplications";
import EmployeeCRUD from "../components/hr/EmployeeCRUD";
import AnnouncementsManager from "../components/hr/AnnouncementsManager";
import AttendanceSummary from "../components/hr/AttendanceSummary";
import Logo from "../components/ui/Logo";

export default function HrDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("leaves");

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
        <div className="portal-content-wrap">
          <h1 className="hr-dashboard-heading">HR Dashboard</h1>

          {/* Subnav Tabs */}
          <div className="portal-tabs hr-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "leaves"}
              className={`portal-tab ${activeTab === "leaves" ? "active" : ""}`}
              onClick={() => setActiveTab("leaves")}
            >
              <span>Leave Applications</span>
              {activeTab === "leaves" && <div className="tab-indicator" />}
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "employees"}
              className={`portal-tab ${activeTab === "employees" ? "active" : ""}`}
              onClick={() => setActiveTab("employees")}
            >
              <span>Employee Management</span>
              {activeTab === "employees" && <div className="tab-indicator" />}
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "announcements"}
              className={`portal-tab ${activeTab === "announcements" ? "active" : ""}`}
              onClick={() => setActiveTab("announcements")}
            >
              <span>Announcements</span>
              {activeTab === "announcements" && <div className="tab-indicator" />}
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "attendance"}
              className={`portal-tab ${activeTab === "attendance" ? "active" : ""}`}
              onClick={() => setActiveTab("attendance")}
            >
              <span>Attendance</span>
              {activeTab === "attendance" && <div className="tab-indicator" />}
            </button>
          </div>
          <div className="tabs-divider" style={{ marginBottom: "2rem" }} />

          {/* Tab Content */}
          <div className="hr-tab-content">
            {activeTab === "leaves" && <LeaveApplications />}
            {activeTab === "employees" && <EmployeeCRUD />}
            {activeTab === "announcements" && <AnnouncementsManager />}
            {activeTab === "attendance" && <AttendanceSummary />}
          </div>
        </div>
      </main>
    </div>
  );
}
