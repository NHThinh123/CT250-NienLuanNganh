const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const menuSchema = new mongoose.Schema(
  {
    menu_name: { type: String },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
menuSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;