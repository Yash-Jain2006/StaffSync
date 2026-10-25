const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const { asyncHandler, HttpError } = require("../middleware/helpers");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const authPayload = (user) => ({
  token: signToken(user._id),
  user: { _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department },
});

// POST /api/auth/register  — creates account with chosen role (Employee, Manager, or HR)
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const role = ["HR", "Manager", "Employee"].includes(req.body.role) ? req.body.role : "Employee";

  if (!name || !email || !password) throw new HttpError(400, "Name, email and password are required");
  if (typeof password !== "string" || password.length < 8)
    throw new HttpError(400, "Password must be at least 8 characters");

  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) throw new HttpError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password, role, department: "Unassigned" });
  await Employee.create({
    user: user._id,
    name: user.name,
    email: user.email,
    department: "Unassigned",
    position: role,
    salary: 0,
  });
  res.status(201).json(authPayload(user));
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, "Email and password are required");

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  const ok = user && user.isActive && (await user.matchPassword(String(password)));
  if (!ok) throw new HttpError(401, "Invalid email or password");

  res.json(authPayload(user));
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  const u = req.user;
  res.json({ _id: u._id, name: u.name, email: u.email, role: u.role, department: u.department });
});
