const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Links to the hungry person!
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // Links to the specific food bag they bought!
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Links to the restaurant so they can fetch their orders
        required: true
    },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: Number, required: true },
    itemName: { type: String, default: "" },
    itemPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paymentId: { type: String, default: "" },
    paymentOrderId: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["reserved", "paid", "picked_up", "cancelled"], // The stages of an order
        default: "reserved"
    }
});

module.exports = mongoose.model("Order", orderSchema);
