import React, { useState } from "react";
import api, { errMsg } from "../../api/client";
import { Alert } from "../ui/ui";

const empty = { leaveType: "Casual", startDate: "", endDate: "", reason: "" };

export default function LeaveApply({ onDone }) {
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState({ kind: "error", text: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.endDate < form.startDate)
      return setMsg({ kind: "error", text: "End date cannot be before start date." });
    setBusy(true);
    try {
      await api.post("/leaves", form);
      setForm(empty);
      setMsg({ kind: "ok", text: "Leave request submitted successfully." });
      onDone?.();
    } catch (err) {
      setMsg({ kind: "error", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="portal-card">
      <h3 className="card-header-title">Apply for Leave</h3>
      <Alert kind={msg.kind}>{msg.text}</Alert>

      <form onSubmit={submit} className="leave-apply-form">
        <div className="leave-dates-row">
          <div className="auth-field">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              required
              value={form.startDate}
              onChange={set("startDate")}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              required
              min={form.startDate}
              value={form.endDate}
              onChange={set("endDate")}
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            required
            rows={3}
            placeholder="Reason for leave"
            value={form.reason}
            onChange={set("reason")}
          />
        </div>

        <button type="submit" className="btn-primary btn-apply-leave" disabled={busy}>
          {busy ? "Applying..." : "Apply Leave"}
        </button>
      </form>
    </div>
  );
}
