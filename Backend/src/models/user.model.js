const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    verified: { type: Boolean, default: false },

    role: { type: String, required: true, enum: ["user", "admin"] },

    avatar: { type: String, default: "" },

  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
userSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const User = mongoose.model("User", userSchema);

module.exports = User;
