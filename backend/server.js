const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

// Load environment variables
require("dotenv").config();

// Force Node.js to use Google DNS
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);
dns.setDefaultResultOrder("ipv4first");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// ===============================
// IMPORT ROUTES
// ===============================

const authRoute = require("./routes/auth");
const itemRoute = require("./routes/item");
const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/payment");

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoute);
app.use("/api/items", itemRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);

// ===============================
// RAZORPAY KEY
// ===============================

app.get("/api/payments/get-razorpay-key", (req, res) => {
    res.status(200).json({
        key: process.env.RAZORPAY_KEY_ID
    });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
    res.send("Server is running");
});

// ===============================
// MONGODB + SERVER START
// ===============================

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas successfully!");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Error connecting MongoDB Atlas:");
        console.error(error.message);
    });