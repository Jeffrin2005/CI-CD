const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const verifyToken = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -----------------------------------------
// POST: Create a Razorpay Payment Order
// -----------------------------------------
router.post("/create-payment-order", verifyToken, async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR (not paise yet)

        const options = {
            amount: amount * 100, // Razorpay works in paise (1 INR = 100 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const paymentOrder = await razorpay.orders.create(options);
        res.status(200).json(paymentOrder);

    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ message: "Error creating payment order", error: error.message });
    }
});

// -----------------------------------------
// POST: Verify Payment + Save Order
// -----------------------------------------
router.post("/verify-payment", verifyToken, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            // Order details
            consumer, item, restaurant, customerName, phone, location, quantity
        } = req.body;

        // --- Verify the payment signature (Security Check!) ---
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed! Invalid signature." });
        }

        // --- Payment is verified! Now save the order ---
        const Item = require("../models/Item");
        const foodItem = await Item.findById(item);

        if (!foodItem) return res.status(404).json({ message: "Food item not found!" });
        if (foodItem.quantity < quantity) return res.status(400).json({ message: `Only ${foodItem.quantity} left!` });

        const newOrder = new Order({
            consumer,
            item,
            restaurant,
            customerName,
            phone,
            location,
            quantity,
            paymentId: razorpay_payment_id,
            paymentOrderId: razorpay_order_id,
            status: "paid",
            isPaid: true,
        });

        await newOrder.save();

        // Deduct quantity
        foodItem.quantity -= quantity;
        if (foodItem.quantity <= 0) {
            await Item.findByIdAndDelete(item);
        } else {
            await foodItem.save();
        }

        res.status(201).json({
            message: "Payment successful! Order confirmed.",
            order: await newOrder.populate("item", "name discountPrice originalPrice")
        });

    } catch (error) {
        console.error("Payment Verify Error:", error);
        res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
});

module.exports = router;
