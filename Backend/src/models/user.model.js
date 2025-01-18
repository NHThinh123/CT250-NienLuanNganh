const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true },
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
