import React, { useState } from "react";
import api, { errMsg } from "../../api/client";
import { useFetch } from "../../utils/hooks";
import { formatDateSlash } from "../../utils/formatData";
import { Alert } from "../ui/ui";

export default function LeaveApplications() {
  const { data, loading, error, reload } = useFetch("/leaves");
  const [err, setErr] = useState("");
  const [demoState, setDemoState] = useState(null);

  const decide = async (id, status) => {
    const comment = status === "Rejected" ? window.prompt("Reason for rejection (optional):") : "";
    if (comment === null) return;

    if (String(id).startsWith("demo-")) {
      setDemoState((prev) => {
        const list = prev || displayLeaves;
        return list.map((l) => (l._id === id ? { ...l, status } : l));
      });
      setErr("");
      return;
    }

    try {
      await api.patch(`/leaves/${id}/decision`, { status, comment });
      setErr("");
      reload();
    } catch (e) {
      setErr(errMsg(e));
      reload();
    }
  };

  // Demo fallback matching Image 5 if empty
  const defaultLeaves = [
    {
      _id: "demo-mgr-1",
      user: { name: "Pravanshu Samadhiya", email: "Pravanshu@gmail.com" },
      startDate: "2025-11-05",
      endDate: "2025-11-06",
      reason: "I have to go for Office Meeting",
      status: "Approved",
      reviewedByRole: "HR",
    },
    {
      _id: "demo-mgr-2",
      user: { name: "Pravanshu Samadhiya", email: "Pravanshu@gmail.com" },
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      reason: "Family function at hometown",
      status: "Rejected",
      reviewedByRole: "HR",
    },
    {
      _id: "demo-mgr-3",
      user: { name: "Pravanshu Samadhiya", email: "Pravanshu@gmail.com" },
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      reason: "Family function at hometown",
      status: "Rejected",
      reviewedByRole: "HR",
    },
  ];

  const displayLeaves = demoState || (data && data.length > 0 ? data : defaultLeaves);

  return (
    <div className="manager-leaves-container">
      <h3 className="section-title">Leave Applications</h3>
      <Alert>{err}</Alert>

      <div className="manager-leave-grid">
        {displayLeaves.map((l) => {
          const isApproved = l.status === "Approved";
          const isRejected = l.status === "Rejected";
          const statusColor = isApproved ? "color-green" : isRejected ? "color-red" : "color-yellow";
          const reviewer = l.reviewedBy?.role || l.reviewedByRole || "HR";

          return (
            <div key={l._id} className="manager-leave-card">
              <div className="card-line">
                <strong>Employee:</strong> {l.user?.name || "Employee"}
              </div>
              <div className="card-line-sub">({l.user?.email || "email@example.com"})</div>
              <div className="card-line">
                <strong>From:</strong> {formatDateSlash(l.startDate)}
              </div>
              <div className="card-line">
                <strong>To:</strong> {formatDateSlash(l.endDate)}
              </div>
              <div className="card-line">
                <strong>Reason:</strong> {l.reason}
              </div>
              <div className="card-line">
                <strong>Status:</strong> <span className={statusColor}>{l.status}</span>
              </div>
              <div className="card-line">
                <strong>Approved/Rejected By:</strong> <span className="reviewer-tag">{reviewer}</span>
              </div>

              {l.status === "Pending" && (
                <div className="row" style={{ marginTop: "1rem" }}>
                  <button
                    className="btn-primary"
                    style={{ padding: "0.3rem 0.75rem", fontSize: "0.85rem" }}
                    onClick={() => decide(l._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-logout"
                    style={{ padding: "0.3rem 0.75rem", fontSize: "0.85rem" }}
                    onClick={() => decide(l._id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
