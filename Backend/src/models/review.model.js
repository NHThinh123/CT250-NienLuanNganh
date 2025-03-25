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
      default: null,
    },
    business_id_review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null,
    },
    business_id_feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null,
    },
    review_rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    review_contents: {
      type: String,
      maxlength: 2000,
      trim: true,
      default: null,
    },
    parent_review_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
  },
  { timestamps: true }
);

reviewSchema.pre("validate", function (next) {
  if (this.user_id && this.business_id_review && this.business_id_feedback) {
    return next(
      new Error(
        "Chỉ một trong 3 trường user_id, business_id_feedback hoặc business_id_review được phép có giá trị."
      )
    );
  }
  if (!this.user_id && !this.business_id_review && !this.business_id_feedback) {
    return next(
      new Error(
        "Cần ít nhất một trong 3 trường user_id, business_id_feedback hoặc business_id_review."
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
