const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  password: String,
  status: { type: String, enum: ["pending", "active"], default: "pending" },
  verificationToken: String,
  tokenExpires: Date,

  cvUrl: String,
  candidatureValidee: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
