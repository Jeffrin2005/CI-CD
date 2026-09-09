const mongoose = require("mongoose");

// 1. We build the Blueprint (Schema)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // No two users can have the same email!
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["consumer", "restaurant"], // It MUST be one of these two words
        default: "consumer"
    }
});

// 2. We export the completed Model
module.exports = mongoose.model("User", userSchema);
