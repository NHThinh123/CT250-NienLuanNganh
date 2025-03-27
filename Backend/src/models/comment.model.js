const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parent_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    comment_content: { type: String, required: true },
    isEdited: { type: Boolean, default: false }, // Thêm trường để đánh dấu đã chỉnh sửa
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
commentSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
