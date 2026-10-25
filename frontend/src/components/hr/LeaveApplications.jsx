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
    if (String(id).startsWith("demo-")) {
      setDemoState((prev) => {
        const list = prev || displayLeaves;
        return list.map((l) => (l._id === id ? { ...l, status } : l));
      });
      setErr("");
      return;
    }
    try {
      await api.patch(`/leaves/${id}/decision`, { status });
      setErr("");
      reload();
    } catch (e) {
      setErr(errMsg(e));
      reload();
    }
  };

  // Demo fallback matching Image 1 if empty
  const defaultLeaves = [
    {
      _id: "demo-hr-leave-1",
      user: { name: "Pravanshu Samadhiya", email: "Pravanshu@gmail.com" },
      startDate: "2025-11-05",
      endDate: "2025-11-06",
      reason: "I have to go for Office Meeting",
      status: "Approved",
    },
    {
      _id: "demo-hr-leave-2",
      user: { name: "Pravanshu Samadhiya", email: "Pravanshu@gmail.com" },
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      reason: "Family function at hometown",
      status: "Rejected",
    },
    {
      _id: "demo-hr-leave-3",
      user: { name: "Pravanshu Samadhiya", email: "Pravanshu@gmail.com" },
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      reason: "Family function at hometown",
      status: "Rejected",
    },
  ];

  const displayLeaves = demoState || (data && data.length > 0 ? data : defaultLeaves);

  return (
    <div className="portal-card">
      <h3 className="card-header-title">Leave Applications</h3>
      <Alert>{err}</Alert>

      <div className="table-wrap hr-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaves.map((l) => (
              <tr key={l._id}>
                <td>{l.user?.name || "Employee"}</td>
                <td>{l.user?.email || "email@example.com"}</td>
                <td>{formatDateSlash(l.startDate)}</td>
                <td>{formatDateSlash(l.endDate)}</td>
                <td>{l.reason}</td>
                <td>{l.status}</td>
                <td>
                  <div className="row" style={{ gap: "0.5rem" }}>
                    <button
                      className="btn-action-approve"
                      onClick={() => decide(l._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-action-reject"
                      onClick={() => decide(l._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
