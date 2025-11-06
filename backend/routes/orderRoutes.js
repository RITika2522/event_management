const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Place an order (USER)
router.post("/place", authMiddleware, roleMiddleware("user"), async (req, res) => {
    try {
        const userId = req.user.id;
        const userName = req.user.name; // Make sure authMiddleware sets req.user.name
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Get full item details to include vendorId
        const enrichedItems = await Promise.all(
            cart.items.map(async (cartItem) => {
                const dbItem = await Item.findById(cartItem.itemId);
                return {
                    itemId: cartItem.itemId,
                    vendorId: dbItem.vendorId,  // VendorId added here
                    title: dbItem.title,
                    price: dbItem.price,
                    quantity: cartItem.quantity,
                };
            })
        );

        // Calculate total
        const totalAmount = enrichedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Create and save order
        const newOrder = new Order({
            userId,
            userName,
            items: enrichedItems,
            totalAmount,
        });

        await newOrder.save();

        // Clear the cart
        cart.items = [];
        await cart.save();

        res.json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ message: "Error placing order" });
    }
});

// Vendor — Get all orders that include vendor’s items
router.get("/vendor", authMiddleware, roleMiddleware("vendor"), async (req, res) => {
    try {
        const vendorId = req.user.id;
        const orders = await Order.find({ "items.vendorId": vendorId })
            .populate("userId", "name email");

        res.json(orders);
    } catch (err) {
        console.error("Error fetching vendor orders:", err);
        res.status(500).json({ message: "Error fetching vendor orders" });
    }
});

module.exports = router;