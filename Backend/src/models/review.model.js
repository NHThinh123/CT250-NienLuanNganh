const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    business_id_review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null,
    },
    review_rating: { type: Number, required: true, min: 1, max: 5 },
    review_contents: {
      type: String,
      minlength: 1,
      maxlength: 1000,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.pre("validate", function (next) {
  if (this.user_id && this.business_id_review) {
    return next(
      new Error(
        "Chỉ một trong hai trường user_id hoặc business_id_review được phép có giá trị."
      )
    );
  }
  if (!this.user_id && !this.business_id_review) {
    return next(
      new Error(
        "Cần ít nhất một trong hai trường user_id hoặc business_id_review."
      )
    );
  }
  next();
});

// Thêm plugin xóa mềm
reviewSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
