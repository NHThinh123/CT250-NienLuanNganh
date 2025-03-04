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
    rating_average: { type: Number, default: 5, min: 1, max: 5 },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending'
    },
    activationPayment: {
      type: Boolean,
      default: false
    },
    lastPaymentDate: {
      type: Date
    },
    nextPaymentDueDate: {
      type: Date
    }
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
BusinessSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Business", BusinessSchema);