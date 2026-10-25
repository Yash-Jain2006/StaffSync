const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Day key "YYYY-MM-DD" -> one record per user per day
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ["Present", "Absent", "Half-day"], default: "Present" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
