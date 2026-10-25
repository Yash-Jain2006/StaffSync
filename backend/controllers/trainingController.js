const Training = require("../models/Training");
const Employee = require("../models/Employee");
const { asyncHandler, HttpError, pick, notify } = require("../middleware/helpers");

const FIELDS = ["title", "description", "date", "trainer", "assignedTo"];

const User = require("../models/User");
const mongoose = require("mongoose");

// Managers and HR can assign employees by User ID or Employee ID
const validateAssignees = async (user, ids) => {
  if (!Array.isArray(ids)) return [];
  const unique = [...new Set(ids.map(String).filter(Boolean))];
  const validUserIds = [];

  for (const id of unique) {
    if (!mongoose.Types.ObjectId.isValid(id)) continue;
    const u = await User.findById(id);
    if (u) {
      validUserIds.push(u._id);
      continue;
    }
    const emp = await Employee.findById(id);
    if (emp && emp.user) {
      validUserIds.push(emp.user);
    }
  }
  return [...new Set(validUserIds)];
};

const populateT = (q) => q.populate("assignedTo", "name email").populate("createdBy", "name");

// GET /api/trainings — Employee: assigned to them; Manager/HR: all trainings
exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "Employee") filter.assignedTo = req.user._id;
  const items = await populateT(Training.find(filter).sort({ date: 1 }));
  res.json(items);
});

// POST /api/trainings (Manager, HR)
exports.create = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  data.assignedTo = await validateAssignees(req.user, data.assignedTo);
  const item = await Training.create({ ...data, createdBy: req.user._id });
  await notify(item.assignedTo, { type: "training", relatedId: item._id, message: `You were assigned training: ${item.title}` });
  res.status(201).json(await populateT(Training.findById(item._id)));
});

const loadOwned = async (req) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new HttpError(400, "Invalid training ID format");
  }
  const item = await Training.findById(req.params.id);
  if (!item) throw new HttpError(404, "Training not found");
  return item;
};

// PATCH /api/trainings/:id
exports.update = asyncHandler(async (req, res) => {
  if (String(req.params.id).startsWith("demo-")) {
    const data = pick(req.body, FIELDS);
    data.assignedTo = await validateAssignees(req.user, data.assignedTo);
    const item = await Training.create({ ...data, createdBy: req.user._id });
    return res.status(201).json(await populateT(Training.findById(item._id)));
  }
  const item = await loadOwned(req);
  const data = pick(req.body, FIELDS);
  let added = [];
  if (data.assignedTo !== undefined) {
    data.assignedTo = await validateAssignees(req.user, data.assignedTo);
    const before = item.assignedTo.map(String);
    added = data.assignedTo.filter((id) => !before.includes(id));
  }
  item.set(data);
  await item.save();
  await notify(added, { type: "training", relatedId: item._id, message: `You were assigned training: ${item.title}` });
  res.json(await populateT(Training.findById(item._id)));
});

// DELETE /api/trainings/:id
exports.remove = asyncHandler(async (req, res) => {
  if (String(req.params.id).startsWith("demo-")) {
    return res.json({ message: "Training deleted" });
  }
  const item = await loadOwned(req);
  await item.deleteOne();
  res.json({ message: "Training deleted" });
});
