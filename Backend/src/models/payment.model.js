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
        paymentId: { type: String, required: true, unique: true },
        customerId: { type: String, required: true },
        customerEmail: { type: String },
        invoicePdf: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);