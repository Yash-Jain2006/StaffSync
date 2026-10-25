const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { asyncHandler, HttpError, todayKey } = require("../middleware/helpers");

const HALF_DAY_HOURS = 4;

// POST /api/attendance/check-in
exports.checkIn = asyncHandler(async (req, res) => {
  const date = todayKey();
  const existing = await Attendance.findOne({ user: req.user._id, date });
  if (existing) throw new HttpError(409, "You have already checked in today");
  const rec = await Attendance.create({ user: req.user._id, date, checkIn: new Date(), status: "Present" });
  res.status(201).json(rec);
});

// POST /api/attendance/check-out
exports.checkOut = asyncHandler(async (req, res) => {
  const rec = await Attendance.findOne({ user: req.user._id, date: todayKey() });
  if (!rec) throw new HttpError(400, "You have not checked in today");
  if (rec.checkOut) throw new HttpError(409, "You have already checked out today");
  rec.checkOut = new Date();
  const hours = (rec.checkOut - rec.checkIn) / 36e5;
  rec.status = hours < HALF_DAY_HOURS ? "Half-day" : "Present";
  await rec.save();
  res.json(rec);
});

// GET /api/attendance/mine?limit=
exports.mine = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 60, 200);
  const rows = await Attendance.find({ user: req.user._id }).sort({ date: -1 }).limit(limit);
  res.json(rows);
});

// GET /api/attendance?date=&from=&to=&user=   HR: all; Manager: team
exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  const { date, from, to, user } = req.query;
  if (date) filter.date = String(date);
  else if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = String(from);
    if (to) filter.date.$lte = String(to);
  }

  if (req.user.role === "Manager") {
    const team = (await Employee.find({ manager: req.user._id, isActive: true }).distinct("user")).map(String);
    if (user) {
      if (!team.includes(String(user))) throw new HttpError(403, "This employee is not on your team");
      filter.user = user;
    } else filter.user = { $in: team };
  } else if (user) filter.user = user;

  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
  const rows = await Attendance.find(filter).populate("user", "name email department").sort({ date: -1 }).limit(limit);
  res.json(rows);
});
