const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item",
            },
            title: String,
            price: Number,
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});

module.exports = mongoose.model("Cart", cartSchema);