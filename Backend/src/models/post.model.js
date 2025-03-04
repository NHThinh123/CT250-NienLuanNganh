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
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
postSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
