const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  status: { type: String, enum: ["pending", "active"], default: "pending" },
  verificationToken: { type: String },
  tokenExpires: { type: Date },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
