const express = require("express");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      "6741073deb7b5b00c28fbdeb8a5b5703a41ef8543e4af3225a80e1f35e5fdb4b"
    );

    // Attach token and user data to the response
    res.status(200).json({ message: "Sign-in successful", token, user });

    // Logging
    console.log("Email:", email);
    console.log("User:", user);
    console.log("Token:", token);
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
