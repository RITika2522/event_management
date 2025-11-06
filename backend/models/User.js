const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, minlength: 6, required: true },
  role: { type: String, enum: ["admin", "vendor", "user"], default: "user" },
  vendorType: {type: [String],enum: ["Catering", "Florist", "Decoration", "Lighting", "Others"],default: undefined },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
