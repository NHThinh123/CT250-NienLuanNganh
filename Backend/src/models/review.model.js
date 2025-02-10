const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const reviewSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    business_id: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    review_rating: { type: Number, required: true, min: 1, max: 5 },
    review_contents: { type: String, minlength: 1, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
menuSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;