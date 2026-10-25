import React from "react";

export const Badge = ({ value }) => (
  <span className={`badge ${value || ""}`}>{value || "—"}</span>
);

export const Alert = ({ kind = "error", children }) =>
  children ? (
    <div className={`alert ${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </div>
  ) : null;

export const Loading = () => <div className="spinner">Loading…</div>;
export const Empty = ({ children = "Nothing here yet." }) => (
  <div className="empty">{children}</div>
);

// Standard loading / error / empty wrapper
export function State({ loading, error, empty, emptyText, children }) {
  if (loading) return <Loading />;
  if (error) return <Alert>{error}</Alert>;
  if (empty) return <Empty>{emptyText}</Empty>;
  return children;
}
