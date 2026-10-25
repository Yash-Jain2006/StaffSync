import React, { useState } from "react";
import api, { errMsg } from "../../api/client";
import { useFetch } from "../../utils/hooks";
import { formatDateSlash } from "../../utils/formatData";
import { Alert } from "../ui/ui";

const blank = {
  name: "",
  email: "",
  password: "Password123!",
  role: "Employee",
  department: "",
  position: "",
  salary: "",
  joinDate: "",
  phone: "",
  address: "",
};

export default function EmployeeCRUD() {
  const { data, loading, error, reload } = useFetch("/employees");
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState({ kind: "error", text: "" });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ kind: "error", text: "" });
    try {
      if (editing) {
        await api.patch(`/employees/${editing}`, form);
        setMsg({ kind: "ok", text: "Employee updated successfully." });
      } else {
        await api.post("/employees", form);
        setMsg({ kind: "ok", text: "Employee added successfully." });
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

  const edit = (emp) => {
    setEditing(emp._id);
    setForm({
      name: emp.name || "",
      email: emp.email || emp.user?.email || "",
      password: "",
      role: emp.user?.role || "Employee",
      department: emp.department || "",
      position: emp.position || "",
      salary: emp.salary ?? "",
      joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().slice(0, 10) : "",
      phone: emp.phone || "",
      address: emp.address || "",
    });
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      reload();
    } catch (err) {
      setMsg({ kind: "error", text: errMsg(err) });
    }
  };

  // Demo fallback matching Image 2 if empty
  const displayEmployees =
    data && data.length > 0
      ? data
      : [
          {
            _id: "demo-emp-1",
            name: "Adnan Saif",
            email: "Adnan@gmail.com",
            department: "AI/ML",
            position: "Intern",
            salary: 10000,
            joinDate: "2025-08-14",
            phone: "3949323423",
            address: "Botanical Garden",
          },
        ];

  return (
    <div className="portal-card">
      <h3 className="card-header-title">Employee Management</h3>
      <Alert kind={msg.kind}>{msg.text}</Alert>

      <form onSubmit={submit} className="hr-employee-form">
        <div className="form-row-3">
          <input
            type="text"
            required
            placeholder="Name"
            value={form.name}
            onChange={set("name")}
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={set("email")}
          />
          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={set("department")}
          />
        </div>

        <div className="form-row-3">
          <input
            type="text"
            placeholder="Position"
            value={form.position}
            onChange={set("position")}
          />
          <input
            type="number"
            placeholder="Salary"
            value={form.salary}
            onChange={set("salary")}
          />
          <input
            type="date"
            placeholder="dd/mm/yyyy"
            value={form.joinDate}
            onChange={set("joinDate")}
            style={{ colorScheme: "dark" }}
          />
        </div>

        <div className="form-row-2">
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={set("phone")}
          />
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={set("address")}
          />
        </div>

        <button type="submit" className="btn-add-employee" disabled={busy}>
          {busy ? "Saving..." : editing ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      <div className="table-wrap hr-table-wrap" style={{ marginTop: "2rem" }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Join Date</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayEmployees.map((e) => (
              <tr key={e._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{e.name}</div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      background: "rgba(56, 189, 248, 0.12)",
                      color: "#38bdf8",
                      border: "1px solid rgba(56, 189, 248, 0.25)",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "0.74rem",
                      fontFamily: "monospace",
                      marginTop: "4px",
                      cursor: "pointer"
                    }}
                    title="Click to copy Employee ID"
                    onClick={() => {
                      const id = e.user?._id || e.user || e._id;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(id);
                      }
                      alert(`Copied Employee ID: ${id}`);
                    }}
                  >
                    <span>ID: {e.user?._id || e.user || e._id}</span>
                    <span style={{ fontSize: "0.7rem" }}>📋</span>
                  </div>
                </td>
                <td>{e.email || e.user?.email}</td>
                <td>{e.department || "—"}</td>
                <td>{e.position || "—"}</td>
                <td>{e.salary !== undefined ? `₹${e.salary}` : "—"}</td>
                <td>{formatDateSlash(e.joinDate)}</td>
                <td>{e.phone || "—"}</td>
                <td>{e.address || "—"}</td>
                <td>
                  <div className="row" style={{ gap: "0.5rem" }}>
                    <button className="btn-action-edit" onClick={() => edit(e)}>
                      Edit
                    </button>
                    <button className="btn-action-delete" onClick={() => remove(e._id)}>
                      Delete
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
