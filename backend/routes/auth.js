const express = require("express");
const router = express.Router();
const User = require("../models/User")
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
    try {
        // 1. Catch the data from the React form! (req.body holds the form data)
        const { name, email, password, role } = req.body;

        // 2. Use our Blueprint to create a new User object
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            role: role
        });

        // 3. Save it permanently to MongoDB!
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found!please register" });
        }
        if (user.password != password) {
            return res.status(401).json({ message: "Wrong password" });
        }
        const ticket = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.status(200).json({ message: "Login Successful", token: ticket, user: user });
    } catch (error) {
        res.status(500).json({ message: "Error loggin in", error: error.message });
    }
});

module.exports = router; 