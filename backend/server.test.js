const request = require("supertest");
const express = require("express");

// Simple health check express app for unit testing
const app = express();
app.get("/", (req, res) => res.status(200).send("Server is running"));

describe("GET / Health Check Endpoint", () => {
    it("should return 200 OK and 'Server is running'", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Server is running");
    });
});
