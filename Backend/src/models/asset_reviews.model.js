const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const assetReviewsSchema = new mongoose.Schema(
  {
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
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
assetReviewsSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Asset_Reviews = mongoose.model("Asset_Reviews", assetReviewsSchema);

module.exports = Asset_Reviews;
