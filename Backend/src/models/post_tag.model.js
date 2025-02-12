const mongoose = require("mongoose");

const post_tagSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    tag_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  },
  { timestamps: true }
);

const Post_Tag = mongoose.model("Post_Tag", post_tagSchema);

module.exports = Post_Tag;
