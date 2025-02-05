const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const tagSchema = new mongoose.Schema(
  {
    tag_name: { type: String, required: true },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
tagSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
