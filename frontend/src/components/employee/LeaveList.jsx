import React from "react";
import { formatDate } from "../../utils/formatData";

export default function LeaveList({ leaves = [], loading, error }) {
  // If no backend leaves returned yet, use the demo items from Image 2
  const displayLeaves =
    leaves && leaves.length > 0
      ? leaves
      : [
          {
            _id: "demo-leave-1",
            startDate: "2025-11-05",
            endDate: "2025-11-06",
            reason: "I have to go for Office Meeting",
            status: "Approved",
          },
          {
            _id: "demo-leave-2",
            startDate: "2025-11-10",
            endDate: "2025-11-12",
            reason: "Family function at hometown",
            status: "Rejected",
          },
          {
            _id: "demo-leave-3",
            startDate: "2025-11-10",
            endDate: "2025-11-12",
            reason: "Family function at hometown",
            status: "Rejected",
          },
        ];

  return (
    <div className="portal-card my-leaves-card">
      <h3 className="card-header-title">My Leaves</h3>

      <div className="leaves-list">
        {displayLeaves.map((l) => {
          const statusClass =
            l.status === "Approved"
              ? "badge-approved"
              : l.status === "Rejected"
              ? "badge-rejected"
              : "badge-pending";

          return (
            <div key={l._id} className="leave-item-row">
              <div className="leave-info">
                <div className="leave-dates">
                  {formatDate(l.startDate)} &rarr; {formatDate(l.endDate)}
                </div>
                <div className="leave-reason">{l.reason}</div>
              </div>
              <div className={`leave-status-pill ${statusClass}`}>{l.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
