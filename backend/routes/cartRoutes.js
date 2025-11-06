const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Add item to cart (User)
router.post("/add/:itemId", authMiddleware, roleMiddleware("user"), async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

        const existingItem = cart.items.find((i) => i.itemId.toString() === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                itemId: item._id,
                title: item.title,
                price: item.price,
                quantity: 1,
            });
        }

        await cart.save();
        res.json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart" });
    }
});

// Remove item from cart (User)
router.delete("/remove/:itemId", authMiddleware, roleMiddleware("user"), async (req, res) => {
    try {
        const { itemId } = req.params;
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter((i) => i.itemId.toString() !== itemId);
        await cart.save();
        res.json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart" });
    }
});
// Decrease item quantity in cart (User)
router.post("/decrease/:itemId", authMiddleware, roleMiddleware("user"), async (req, res) => {
    try {
        const userId = req.user.id; // set by authMiddleware
        const { itemId } = req.params;

        const userCart = await Cart.findOne({ userId });
        if (!userCart) return res.status(404).json({ message: "Cart not found" });

        const item = userCart.items.find((i) => i.itemId.toString() === itemId);
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        // Decrease quantity or remove item
        item.quantity -= 1;
        if (item.quantity <= 0) {
            userCart.items = userCart.items.filter((i) => i.itemId.toString() !== itemId);
        }

        await userCart.save();
        res.json({ message: "Item quantity updated", cart: userCart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error decreasing quantity" });
    }
});


// Get user's cart
router.get("/", authMiddleware, roleMiddleware("user"), async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        res.json(cart || { userId: req.user.id, items: [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
    }
});

module.exports = router;