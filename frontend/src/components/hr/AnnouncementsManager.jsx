import React, { useState } from "react";
import api, { errMsg } from "../../api/client";
import { useFetch } from "../../utils/hooks";
import { Alert } from "../ui/ui";

const blank = { title: "", message: "", targetAudience: "All" };

export default function AnnouncementsManager() {
  const { data, loading, error, reload } = useFetch("/announcements");
  const [form, setForm] = useState(blank);
  const [msg, setMsg] = useState({ kind: "error", text: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ kind: "error", text: "" });
    try {
      await api.post("/announcements", form);
      setMsg({ kind: "ok", text: "Announcement created successfully." });
      setForm(blank);
      reload();
    } catch (err) {
      setMsg({ kind: "error", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="portal-card">
      <h3 className="card-header-title">Announcements</h3>
      <Alert kind={msg.kind}>{msg.text}</Alert>

      <form onSubmit={submit} className="hr-announcement-form">
        <input
          type="text"
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          required
          rows={4}
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <div className="announcement-actions-row">
          <select
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
            className="select-audience"
          >
            <option value="All">All</option>
            <option value="Employees">Employees</option>
            <option value="Managers">Managers</option>
          </select>

          <button type="submit" className="btn-create-announcement" disabled={busy}>
            {busy ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
