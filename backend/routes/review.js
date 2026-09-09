const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const verifyToken = require("../middleware/authMiddleware");

// -----------------------------------------
// POST: Consumer leaves a Review
// -----------------------------------------
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { rating, comment, consumer, restaurant } = req.body;

        const newReview = new Review({
            rating: rating,
            comment: comment,
            consumer: consumer,
            restaurant: restaurant
        });

        await newReview.save();
        res.status(201).json({ message: "Review posted successfully!", review: newReview });

    } catch (error) {
        res.status(500).json({ message: "Error posting review", error: error.message });
    }
});

module.exports = router;
