const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This tells MongoDB: "This ID belongs to a User!"
        required: true
    }
});

module.exports = mongoose.model("Item", itemSchema);
