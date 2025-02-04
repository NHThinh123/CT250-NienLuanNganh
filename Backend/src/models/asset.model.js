const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const assetSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    type: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
assetSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
