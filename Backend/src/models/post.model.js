const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    linked_business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    edited: { type: Boolean, default: false }, // Thêm trường edited
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Thêm plugin xóa mềm
postSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường deletedAt
  overrideMethods: "all", // Ghi đè các phương thức mặc định
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
