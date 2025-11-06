const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Add new item (Vendor)
router.post("/add", authMiddleware, roleMiddleware("vendor"), async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const item = new Item({
            title,
            description,
            price,
            vendorId: req.user.id,
        });
        await item.save();
        res.status(201).json({ message: "Item added successfully", item });
    } catch (error) {
        res.status(500).json({ message: "Error adding item" });
    }
});

// Get all items (everyone)
router.get("/", async (req, res) => {
    try {
        const items = await Item.find().populate("vendorId", "name email");
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items" });
    }
});

// Update item (Vendor only)
router.put("/:id", authMiddleware, roleMiddleware("vendor"), async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        // vendor can update only their items
        if (item.vendorId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own items" });
        }

        item.title = req.body.title;
        item.description = req.body.description;
        item.price = req.body.price;
        await item.save();

        res.json({ message: "Item updated successfully", item });
    } catch (error) {
        res.status(500).json({ message: "Error updating item" });
    }
});

// Delete item (Vendor only)
router.delete("/:id", authMiddleware, roleMiddleware("vendor"), async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (item.vendorId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own items" });
        }

        await item.deleteOne();
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item" });
    }
});

module.exports = router;