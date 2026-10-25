const Announcement = require("../models/Announcement");
const User = require("../models/User");
const { asyncHandler, HttpError, pick, notify } = require("../middleware/helpers");

const AUDIENCES = ["All", "Employees", "Managers"];

// GET /api/announcements — scoped by the viewer's role
exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "Employee") filter.targetAudience = { $in: ["All", "Employees"] };
  if (req.user.role === "Manager") filter.targetAudience = { $in: ["All", "Managers"] };
  const items = await Announcement.find(filter).populate("createdBy", "name").sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

// POST /api/announcements (HR)
exports.create = asyncHandler(async (req, res) => {
  const data = pick(req.body, ["title", "message", "targetAudience"]);
  if (data.targetAudience && !AUDIENCES.includes(data.targetAudience)) throw new HttpError(400, "Invalid audience");
  const item = await Announcement.create({ ...data, createdBy: req.user._id });

  const roleFilter =
    item.targetAudience === "Employees" ? { role: "Employee" } : item.targetAudience === "Managers" ? { role: "Manager" } : { role: { $in: ["Employee", "Manager"] } };
  const recipients = await User.find({ ...roleFilter, isActive: true }).distinct("_id");
  await notify(recipients, { type: "announcement", relatedId: item._id, message: `New announcement: ${item.title}` });

  res.status(201).json(item);
});

// PATCH /api/announcements/:id (HR)
exports.update = asyncHandler(async (req, res) => {
  const data = pick(req.body, ["title", "message", "targetAudience"]);
  if (data.targetAudience && !AUDIENCES.includes(data.targetAudience)) throw new HttpError(400, "Invalid audience");
  const item = await Announcement.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!item) throw new HttpError(404, "Announcement not found");
  res.json(item);
});

// DELETE /api/announcements/:id (HR)
exports.remove = asyncHandler(async (req, res) => {
  const item = await Announcement.findByIdAndDelete(req.params.id);
  if (!item) throw new HttpError(404, "Announcement not found");
  res.json({ message: "Announcement deleted" });
});
