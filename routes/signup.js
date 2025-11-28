const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const userId = generateUserId(firstName, lastName, email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    req.session.user = newUser;
    res.status(201).json({ message: "Signup successful" });

    console.log("New user:", newUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to generate unique user ID
function generateUserId(firstName, lastName, email) {
  const dataToHash = firstName + lastName + email;
  const hashedData = bcrypt.hashSync(dataToHash, 10);
  const userId = hashedData.replace(/\W/g, "");
  return userId;
}

module.exports = router;
