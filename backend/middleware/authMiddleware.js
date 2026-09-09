const jwt = require("jsonwebtoken");

// This is the Bouncer!
const verifyToken = (req, res, next) => {
    // 1. The Bouncer asks for the ticket (it is sent in the headers)
    let ticket = req.header("Authorization");

    // Remove 'Bearer ' if it was sent from the frontend
    if (ticket && ticket.startsWith("Bearer ")) {
        ticket = ticket.replace("Bearer ", "");
    }

    // 2. If they don't have a ticket, kick them out!
    if (!ticket) {
        return res.status(401).json({ message: "Access Denied! No ticket provided." });
    }

    try {
        // 3. The Bouncer inspects the ticket to make sure it isn't fake
        const verifiedData = jwt.verify(ticket, process.env.JWT_SECRET);

        // 4. If it's real, the Bouncer attaches the user data to the request
        req.user = verifiedData;

        // 5. Let them through the door!
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        console.error("Received Ticket:", ticket);
        // If the ticket is fake or expired, kick them out!
        res.status(400).json({ message: "Invalid Ticket!" });
    }
};

module.exports = verifyToken;
