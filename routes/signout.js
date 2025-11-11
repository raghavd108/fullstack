const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // Clear the session data
  req.session.destroy((err) => {
    if (err) {
      // Handle any error that occurred during session destruction
      res.status(500).json({ message: "Error occurred during sign-out" });
    } else {
      // Sign-out successful
      res.status(200).json({ message: "Sign-out successful" });
    }
  });
});

module.exports = router;
