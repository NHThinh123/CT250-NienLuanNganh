const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcryptjs");

const BusinessSchema = new mongoose.Schema(
  {
    business_name: { type: String, required: true },
    open_hours: { type: String, required: true },
    close_hours: { type: String, required: true },
    address: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    location: { type: String, required: true },
    contact_info: { type: String, required: true },
    avatar: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rating_average: { type: Number, default: 0, min: 0, max: 5 },
    dish_lowest_cost: { type: Number, default: 0 },
    dish_highest_cost: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },
    activationPayment: {
      type: Boolean,
      default: false,
    },
    lastPaymentDate: {
      type: Date,
    },
    nextPaymentDueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Tạo index 2dsphere để hỗ trợ truy vấn địa lý (nếu cần sau này)
BusinessSchema.index({ address: "2dsphere" });

// Thêm plugin xóa mềm
BusinessSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Business", BusinessSchema);
