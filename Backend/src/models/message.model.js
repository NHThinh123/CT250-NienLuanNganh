
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "senderModel",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "receiverModel",
            required: true,
        },
        senderModel: {
            type: String,
            required: true,
            enum: ["User", "Business"],
        },
        receiverModel: {
            type: String,
            required: true,
            enum: ["User", "Business"],
        },
        content: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Thêm plugin xóa mềm
messageSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("Message", messageSchema);