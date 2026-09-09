const express = require("express");
const router = express.Router();
const Item = require("../models/Item"); // Bring in the Food Bag blueprint!
const User = require("../models/User"); // Explicitly load User for populate
const verifyToken = require("../middleware/authMiddleware");
// testing for devops
// onceagin testing ci/cd pipelines
// pls fix it 
// -----------------------------------------
// POST: Restaurant Admin adds a Rescue Bag
// -----------------------------------------
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { name, description, originalPrice, discountPrice, quantity, restaurant } = req.body;

        const newItem = new Item({
            name: name,
            description: description,
            originalPrice: originalPrice,
            discountPrice: discountPrice,
            quantity: quantity,
            restaurant: restaurant // This is the ID tag of the Restaurant who posted it!
        });

        await newItem.save();
        res.status(201).json({ message: "Rescue Bag added successfully!", item: newItem });

    } catch (error) {
        res.status(500).json({ message: "Error adding item", error: error.message });
    }
});
// -----------------------------------------
// GET: Restaurant Admin views their own items
// -----------------------------------------
router.get("/me", verifyToken, async (req, res) => {
    try {
        // Fetch items where the restaurant matches the logged-in user's ID
        const myItems = await Item.find({ restaurant: req.user.id });
        res.status(200).json(myItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your items", error: error.message });
    }
});

// -----------------------------------------
// GET: Consumers viewing all available food!
// -----------------------------------------
router.get("/all", async (req, res) => {
    try {
        // Find every single Item and attach the restaurant's name to it!
        const allItems = await Item.find().populate("restaurant", "name");

        res.status(200).json(allItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error: error.message });
    }
});

module.exports = router;
