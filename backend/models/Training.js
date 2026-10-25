const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    date: { type: Date, required: [true, "Date is required"] },
    trainer: { type: String, default: "TBD", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, versionKey: false }
);

trainingSchema.index({ assignedTo: 1 });

module.exports = mongoose.model("Training", trainingSchema);
