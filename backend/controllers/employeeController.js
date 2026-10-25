const User = require("../models/User");
const Employee = require("../models/Employee");
const { asyncHandler, HttpError, pick } = require("../middleware/helpers");

const HR_FIELDS = ["name", "department", "position", "salary", "joinDate", "phone", "address", "manager"];
const ROLES = ["Employee", "Manager"]; // HR accounts are only created through the seed script

const withManager = (q) => q.populate("manager", "name email").populate("user", "role isActive");

// Salary is visible to HR only
const sanitize = (doc, viewer) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  if (viewer.role !== "HR") delete obj.salary;
  return obj;
};

const assertManagerRef = async (managerId) => {
  if (!managerId) return null;
  const m = await User.findOne({ _id: managerId, role: "Manager", isActive: true });
  if (!m) throw new HttpError(400, "Selected manager is not a valid active Manager");
  return m._id;
};

// GET /api/employees  (HR: everyone active; Manager: team if teamOnly, otherwise all active)
exports.list = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.user.role === "Manager" && req.query.teamOnly === "true") {
    filter.manager = req.user._id;
  }
  const { search, department } = req.query;
  if (department) filter.department = String(department);
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { position: rx }];
  }
  const employees = await withManager(Employee.find(filter).sort({ name: 1 }));
  res.json(employees.map((e) => sanitize(e, req.user)));
});

// GET /api/employees/me
exports.getMe = asyncHandler(async (req, res) => {
  const emp = await withManager(Employee.findOne({ user: req.user._id }));
  if (!emp) throw new HttpError(404, "Employee profile not found");
  const obj = emp.toObject();
  delete obj.salary; // self-service view never needs salary
  res.json(obj);
});

// PATCH /api/employees/me  (only contact fields)
exports.updateMe = asyncHandler(async (req, res) => {
  const emp = await Employee.findOneAndUpdate({ user: req.user._id }, pick(req.body, ["phone", "address"]), {
    new: true,
    runValidators: true,
  });
  if (!emp) throw new HttpError(404, "Employee profile not found");
  const obj = emp.toObject();
  delete obj.salary;
  res.json(obj);
});

// POST /api/employees  (HR) — creates login account + profile
exports.create = asyncHandler(async (req, res) => {
  const { email, password, role = "Employee" } = req.body;
  if (!ROLES.includes(role)) throw new HttpError(400, "Role must be Employee or Manager");
  if (!email || !password) throw new HttpError(400, "Email and password are required");
  if (String(password).length < 8) throw new HttpError(400, "Password must be at least 8 characters");
  if (await User.findOne({ email: String(email).toLowerCase() }))
    throw new HttpError(409, "An account with this email already exists");

  const data = pick(req.body, HR_FIELDS);
  data.manager = await assertManagerRef(data.manager);

  const user = await User.create({ name: data.name, email, password, role, department: data.department });
  try {
    const emp = await Employee.create({ ...data, user: user._id, email: user.email });
    res.status(201).json(sanitize(emp, req.user));
  } catch (e) {
    await User.findByIdAndDelete(user._id); // roll back the account if the profile is invalid
    throw e;
  }
});

// PATCH /api/employees/:id  (HR)
exports.update = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp || !emp.isActive) throw new HttpError(404, "Employee not found");

  const data = pick(req.body, HR_FIELDS);
  if ("manager" in data) data.manager = await assertManagerRef(data.manager);
  emp.set(data);
  await emp.save();

  const userUpdate = pick(data, ["name", "department"]);
  if (req.body.role !== undefined) {
    if (!ROLES.includes(req.body.role)) throw new HttpError(400, "Role must be Employee or Manager");
    const target = await User.findById(emp.user);
    if (target.role === "HR") throw new HttpError(403, "HR accounts cannot be changed here");
    userUpdate.role = req.body.role;
  }
  if (Object.keys(userUpdate).length) await User.findByIdAndUpdate(emp.user, userUpdate);

  res.json(sanitize(emp, req.user));
});

// DELETE /api/employees/:id  (HR) — soft delete: deactivates login + profile
exports.remove = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) throw new HttpError(404, "Employee not found");
  if (String(emp.user) === String(req.user._id)) throw new HttpError(400, "You cannot deactivate your own account");
  emp.isActive = false;
  await emp.save();
  await User.findByIdAndUpdate(emp.user, { isActive: false });
  // Anyone reporting to a removed manager becomes unassigned
  await Employee.updateMany({ manager: emp.user }, { manager: null });
  res.json({ message: "Employee deactivated" });
});

// GET /api/employees/managers  (HR) — for the "reports to" dropdown
exports.managers = asyncHandler(async (req, res) => {
  const list = await User.find({ role: "Manager", isActive: true }).select("name email").sort({ name: 1 });
  res.json(list);
});
