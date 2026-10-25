import React from "react";
import DashboardShell from "../components/ui/DashboardShell";
import Announcements from "../components/employee/Announcements";
import Attendance from "../components/employee/Attendance";
import LeaveApply from "../components/employee/LeaveApply";
import LeaveList from "../components/employee/LeaveList";
import { useFetch, fmtDate } from "../utils/hooks";
import { useAuth } from "../utils/AuthContext";

function LeavesTab() {
  const { data: leaves, loading, error, reload } = useFetch("/leaves/mine");
  return (
    <div className="stack">
      <LeaveApply onDone={reload} />
      <LeaveList leaves={leaves} loading={loading} error={error} />
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const displayName = user?.name || "John Doe";
  const displayEmail = user?.email || "johndoe@email.com";
  const displayRole = user?.role || "Employee";

  return (
    <div className="portal-card profile-card-wrap">
      <h3 className="card-header-title">My Profile</h3>
      <div className="my-profile-content">
        <p className="profile-line">
          <strong>Name:</strong> {displayName}
        </p>
        <p className="profile-line">
          <strong>Email:</strong> {displayEmail}
        </p>
        <p className="profile-line">
          <strong>Role:</strong> {displayRole}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  return (
    <DashboardShell
      title="Employee"
      tabs={[
        { id: "announcements", label: "Announcements", render: () => <Announcements /> },
        { id: "leaves", label: "Leaves", render: () => <LeavesTab /> },
        { id: "attendance", label: "Attendance", render: () => <Attendance /> },
        { id: "profile", label: "Profile", render: () => <ProfileTab /> },
      ]}
    />
  );
}
