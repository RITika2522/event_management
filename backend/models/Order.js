const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
            vendorId: String,
            title: String,
            price: Number,
            quantity: Number,
        },
    ],
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);