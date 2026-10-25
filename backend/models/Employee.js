const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: [true, "Department is required"], trim: true },
    position: { type: String, required: [true, "Position is required"], trim: true },
    salary: { type: Number, required: true, min: [0, "Salary cannot be negative"], default: 0 },
    joinDate: { type: Date, required: true, default: Date.now },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    // The manager (a User with role Manager) this employee reports to
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

employeeSchema.index({ manager: 1 });

module.exports = mongoose.model("Employee", employeeSchema);
