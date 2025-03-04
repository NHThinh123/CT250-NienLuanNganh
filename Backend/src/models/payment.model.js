const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        businessName: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);