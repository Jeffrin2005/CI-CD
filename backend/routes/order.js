const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../middleware/authMiddleware");

// -----------------------------------------
// POST: Consumer buys a Rescue Bag
// -----------------------------------------
router.post("/checkout", verifyToken, async (req, res) => {
    try {
        const { consumer, item, restaurant, customerName, phone, location, quantity, paymentId } = req.body;

        const Item = require("../models/Item");
        const foodItem = await Item.findById(item);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found!" });
        }

        if (foodItem.quantity < quantity) {
            return res.status(400).json({ message: `Only ${foodItem.quantity} left!` });
        }

        // Create the receipt
        const newOrder = new Order({
            consumer: consumer,
            item: item,
            restaurant: restaurant,
            customerName: customerName,
            phone: phone,
            location: location,
            quantity: quantity,
            itemName: foodItem.name,
            itemPrice: foodItem.discountPrice,
            totalAmount: foodItem.discountPrice * quantity,
            paymentId: paymentId || "",
            isPaid: true
        });

        await newOrder.save();

        // Deduct quantity
        foodItem.quantity -= quantity;
        if (foodItem.quantity <= 0) {
            await Item.findByIdAndDelete(item);
        } else {
            await foodItem.save();
        }

        res.status(201).json({ message: "Checkout successful! Food reserved.", order: newOrder });

    } catch (error) {
        res.status(500).json({ message: "Error during checkout", error: error.message });
    }
});

// -----------------------------------------
// GET: Restaurant Admin views their orders
// -----------------------------------------
router.get("/restaurant", verifyToken, async (req, res) => {
    try {
        // Fetch orders where the restaurant matches the logged-in user's ID
        const myOrders = await Order.find({ restaurant: req.user.id })
            .populate("item", "name originalPrice discountPrice")
            .sort({ _id: -1 }); // Newest first
            
        res.status(200).json(myOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

// -----------------------------------------
// GET: Consumer views their own orders
// -----------------------------------------
router.get("/consumer", verifyToken, async (req, res) => {
    try {
        const myOrders = await Order.find({ consumer: req.user.id })
            .populate("item", "name originalPrice discountPrice description")
            .populate("restaurant", "name")
            .sort({ _id: -1 }); // Newest first

        res.status(200).json(myOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your orders", error: error.message });
    }
});

module.exports = router;
