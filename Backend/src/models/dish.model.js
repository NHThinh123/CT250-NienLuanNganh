const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const dishSchema = new mongoose.Schema(
  {
    dish_name: { type: String, require: true, trim: true },
    dish_description: {
      type: String,
      minlength: 1,
      maxlength: 1000,
      trim: true,
    },
    dish_price: { type: Number, require: true, min: 1000 },
    dish_url: { type: [String], require: true },
    menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      require: true,
    },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
dishSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
