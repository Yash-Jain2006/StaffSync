const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    leaveType: { type: String, enum: ["Casual", "Sick", "Annual", "Unpaid", "Other"], default: "Casual" },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
    reason: { type: String, required: [true, "Reason is required"], trim: true, maxlength: 500 },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    approverRole: { type: String, enum: ["HR", "Manager"] },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewComment: { type: String, trim: true, maxlength: 300 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

leaveSchema.pre("validate", function () {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "End date cannot be before start date");
  }
});

leaveSchema.index({ user: 1, createdAt: -1 });
leaveSchema.index({ status: 1 });

module.exports = mongoose.model("Leave", leaveSchema);
