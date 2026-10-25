import React, { useState } from "react";
import api, { errMsg } from "../../api/client";
import { useFetch } from "../../utils/hooks";
import { formatDateSlash } from "../../utils/formatData";
import { Alert } from "../ui/ui";

const blank = { title: "", description: "", date: "", trainer: "", assignedTo: "" };

export default function TrainingManagement() {
  const { data, loading, error, reload } = useFetch("/trainings");
  const { data: employees } = useFetch("/employees");
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState({ kind: "error", text: "" });
  const [busy, setBusy] = useState(false);
  const [localDemoTrainings, setLocalDemoTrainings] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ kind: "error", text: "" });
    try {
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        trainer: form.trainer || "TBD",
        assignedTo: form.assignedTo ? [form.assignedTo] : [],
      };

      if (editing && !String(editing).startsWith("demo-")) {
        await api.patch(`/trainings/${editing}`, payload);
        setMsg({ kind: "ok", text: "Training updated successfully." });
      } else {
        await api.post("/trainings", payload);
        setMsg({ kind: "ok", text: editing ? "Training updated successfully." : "Training created successfully." });
      }
      setEditing(null);
      setForm(blank);
      reload();
    } catch (err) {
      setMsg({ kind: "error", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  const edit = (t) => {
    setEditing(t._id);
    setForm({
      title: t.title || "",
      description: t.description || "",
      date: t.date ? new Date(t.date).toISOString().slice(0, 10) : "",
      trainer: t.trainer || "",
      assignedTo: t.assignedTo?.[0]?._id || t.assignedTo?.[0] || "",
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this training?")) return;
    if (String(id).startsWith("demo-")) {
      setLocalDemoTrainings((prev) => (prev || displayTrainings).filter((t) => t._id !== id));
      return;
    }
    try {
      await api.delete(`/trainings/${id}`);
      reload();
    } catch (err) {
      setMsg({ kind: "error", text: errMsg(err) });
    }
  };

  // Demo fallback matching Image 5 if empty
  const defaultTrainings = [
    {
      _id: "demo-train-1",
      title: "MongoDB CRUD",
      description: "This Training Session is based on the MongoDB CRUD Operation.",
      date: "2025-05-11",
      trainer: "Adnan Saif",
      assignedTo: [],
    },
  ];

  const displayTrainings = localDemoTrainings || (data && data.length > 0 ? data : defaultTrainings);

  return (
    <div className="manager-trainings-wrap">
      <div className="portal-card">
        <h3 className="card-header-title">Training &amp; Development</h3>
        <Alert kind={msg.kind}>{msg.text}</Alert>

        <form onSubmit={submit} className="manager-training-form">
          <div className="form-row-2">
            <input
              type="text"
              required
              placeholder="Training Title"
              value={form.title}
              onChange={set("title")}
            />
            <input
              type="date"
              placeholder="dd/mm/yyyy"
              value={form.date}
              onChange={set("date")}
              style={{ colorScheme: "dark" }}
            />
          </div>

          <textarea
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={set("description")}
          />

          <div className="form-row-2">
            <input
              type="text"
              placeholder="Trainer Name"
              value={form.trainer}
              onChange={set("trainer")}
            />
            {employees && employees.length > 0 ? (
              <div>
                <select
                  value={form.assignedTo}
                  onChange={set("assignedTo")}
                  className="select-audience"
                  style={{ width: "100%", padding: "0.75rem 1rem", colorScheme: "dark" }}
                >
                  <option value="">Assign To (Select Employee)</option>
                  {employees.map((emp) => {
                    const id = emp.user?._id || emp.user || emp._id;
                    return (
                      <option key={emp._id} value={id}>
                        {emp.name} — ID: {id}
                      </option>
                    );
                  })}
                </select>
                {form.assignedTo && (
                  <div style={{ color: "#38bdf8", fontSize: "0.78rem", marginTop: "4px", fontFamily: "monospace" }}>
                    Selected ID: {form.assignedTo}
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Assign To (Employee ID)"
                value={form.assignedTo}
                onChange={set("assignedTo")}
              />
            )}
          </div>

          <button type="submit" className="btn-create-training" disabled={busy}>
            {busy ? "Saving..." : editing ? "Update Training" : "Create Training"}
          </button>
        </form>
      </div>

      <div className="training-cards-list" style={{ marginTop: "2rem" }}>
        {displayTrainings.map((t) => (
          <div key={t._id} className="manager-training-card">
            <h4 className="training-card-title">{t.title}</h4>
            <p className="training-card-desc">{t.description}</p>
            <div className="training-card-meta">
              <div>
                <strong>Date:</strong> {formatDateSlash(t.date)}
              </div>
              <div>
                <strong>Trainer:</strong> {t.trainer}
              </div>
              <div>
                <strong>Assigned To:</strong>{" "}
                {t.assignedTo && t.assignedTo.length > 0
                  ? t.assignedTo.map((u, idx) => (
                      <span key={u._id || idx} style={{ marginRight: "0.5rem" }}>
                        {u.name || "Employee"}{" "}
                        <span style={{ color: "#38bdf8", fontSize: "0.8rem", fontFamily: "monospace" }}>
                          (ID: {u._id || u})
                        </span>
                      </span>
                    ))
                  : "N/A"}
              </div>
            </div>
            <div className="row" style={{ marginTop: "1rem", gap: "0.5rem" }}>
              <button className="btn-action-edit-amber" onClick={() => edit(t)}>
                Edit
              </button>
              <button className="btn-action-delete-red" onClick={() => remove(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
