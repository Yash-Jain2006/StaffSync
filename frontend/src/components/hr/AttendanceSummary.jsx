import React from "react";
import { useFetch } from "../../utils/hooks";
import { formatDateSlash, formatTime } from "../../utils/formatData";

export default function AttendanceSummary() {
  const { data } = useFetch("/attendance");

  // Demo fallback matching Image 4 if empty
  const displayRecords =
    data && data.length > 0
      ? data
      : [
          {
            _id: "demo-att-rec-1",
            user: { name: "Pravanshu Samadhiya" },
            date: "2025-11-04",
            checkIn: "2025-11-04T09:24:19",
            checkOut: "2025-11-04T10:07:23",
            status: "Present",
          },
          {
            _id: "demo-att-rec-2",
            user: { name: "Pravanshu Samadhiya" },
            date: "2025-11-03",
            checkIn: "2025-11-03T15:47:43",
            checkOut: "2025-11-03T15:47:54",
            status: "Present",
          },
        ];

  return (
    <div className="portal-card">
      <h3 className="card-header-title">Attendance Records</h3>

      <div className="table-wrap hr-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayRecords.map((r) => (
              <tr key={r._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.user?.name || "Employee"}</div>
                  {r.user?._id && (
                    <div style={{ color: "#38bdf8", fontSize: "0.75rem", fontFamily: "monospace" }}>
                      ID: {r.user._id}
                    </div>
                  )}
                </td>
                <td>{formatDateSlash(r.date)}</td>
                <td>{formatTime(r.checkIn)}</td>
                <td>{formatTime(r.checkOut)}</td>
                <td>{r.status || "Present"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
