const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcryptjs");

const BusinessSchema = new mongoose.Schema(
  {
    business_name: { type: String, required: true },
    open_hours: { type: String, required: true },
    close_hours: { type: String, required: true },
    location: { type: String, required: true },
    contact_info: { type: String, required: true },
    avatar: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
BusinessSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

module.exports = mongoose.model("Business", BusinessSchema);
