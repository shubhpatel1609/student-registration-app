const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    course: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);