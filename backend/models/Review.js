const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1, // Cannot rate 0 stars!
        max: 5  // Cannot rate 6 stars!
    },
    comment: {
        type: String,
        required: true
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // The person writing the review
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // The restaurant receiving the review
        required: true
    }
});

module.exports = mongoose.model("Review", reviewSchema);
