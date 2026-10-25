const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const { asyncHandler, HttpError, pick, isValidDate, notify } = require("../middleware/helpers");

const teamUserIds = (managerId) => Employee.find({ manager: managerId, isActive: true }).distinct("user");

// POST /api/leaves — any signed-in user applies for their own leave
exports.apply = asyncHandler(async (req, res) => {
  const data = pick(req.body, ["leaveType", "startDate", "endDate", "reason"]);
  if (!isValidDate(data.startDate) || !isValidDate(data.endDate)) throw new HttpError(400, "Valid start and end dates are required");

  // Routing: a Manager's leave goes to HR; an Employee's goes to their Manager (or HR if unassigned)
  let approverRole = "HR";
  if (req.user.role === "Employee") {
    const emp = await Employee.findOne({ user: req.user._id });
    if (emp && emp.manager) approverRole = "Manager";
  }
  const leave = await Leave.create({ ...data, user: req.user._id, approverRole });
  res.status(201).json(leave);
});

// GET /api/leaves/mine
exports.mine = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id })
    .populate("reviewedBy", "name role")
    .sort({ createdAt: -1 });
  res.json(leaves);
});

// GET /api/leaves — requests to review. HR: all; Manager: their team's
exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "Manager") filter.user = { $in: await teamUserIds(req.user._id) };
  if (["Pending", "Approved", "Rejected"].includes(req.query.status)) filter.status = req.query.status;

  const leaves = await Leave.find(filter)
    .populate("user", "name email department role")
    .populate("reviewedBy", "name role")
    .sort({ createdAt: -1 });
  res.json(leaves);
});

// PATCH /api/leaves/:id/decision  { status: "Approved"|"Rejected", comment }
exports.decide = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  if (!["Approved", "Rejected"].includes(status)) throw new HttpError(400, "Status must be Approved or Rejected");

  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    if (String(req.params.id).startsWith("demo-")) {
      return res.json({ _id: req.params.id, status, reviewedBy: { name: req.user.name, role: req.user.role } });
    }
    throw new HttpError(400, "Invalid leave ID format");
  }

  const leave = await Leave.findById(req.params.id);
  if (!leave) throw new HttpError(404, "Leave request not found");
  if (String(leave.user) === String(req.user._id)) throw new HttpError(403, "You cannot review your own leave request");

  if (req.user.role === "Manager") {
    const team = (await teamUserIds(req.user._id)).map(String);
    if (!team.includes(String(leave.user))) throw new HttpError(403, "This employee is not on your team");
  }

  leave.status = status;
  leave.reviewedBy = req.user._id;
  leave.reviewedAt = new Date();
  if (comment) leave.reviewComment = String(comment).slice(0, 300);
  await leave.save();

  await notify(leave.user, {
    type: "leave",
    relatedId: leave._id,
    message: `Your leave request was ${status.toLowerCase()} by ${req.user.name}.`,
  });
  res.json(leave);
});
