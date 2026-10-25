const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 150 },
    message: { type: String, required: [true, "Message is required"], trim: true, maxlength: 2000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetAudience: { type: String, enum: ["All", "Employees", "Managers"], default: "All" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Announcement", announcementSchema);
