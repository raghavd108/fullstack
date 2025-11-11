const express = require("express");
const multer = require("multer");
const path = require("path");
const Business = require("../models/Business.js");
const nodemailer = require("nodemailer");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for saving uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
  },
});
const upload = multer({ storage });

// POST: Add a new business
router.post("/", upload.array("inventoryImages[]", 10), async (req, res) => {
  try {
    const {
      businessName,
      contactPerson,
      email,
      phone,
      description,
      locations,
      bankDetails,
    } = req.body;
    const categories = req.body["categories[]"]; // Handle as an array
    const inventoryImages = req.files.map((file) => file.path); // Paths of uploaded images

    const business = new Business({
      businessName,
      contactPerson,
      email,
      phone,
      categories,
      description,
      locations,
      inventoryImages,
      bankDetails,
    });

    await business.save();
    // Sending email with business details
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use another service like 'SMTP' if necessary
      auth: {
        user: "raghavdixit008@gmail.com",
        pass: "kkrh suln tcww xmwg",
      },
    });

    const mailOptions = {
      from: email,
      to: "raghavdixit008@gmail.com", // Sending confirmation email to the business owner's email
      subject: `Business Submission Confirmation: ${businessName}`,
      text: `
        Dear ${contactPerson},

        Thank you for submitting your business details. Here are the details:
        
        Business Name: ${businessName}
        Contact Person: ${contactPerson}
        Email: ${email}
        Phone: ${phone}
        Description: ${description}
        Locations: ${locations}
        Bank Details: ${bankDetails}

        We will get back to you shortly.

        Regards,
        Your Company
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Business data saved successfully", business });
  } catch (error) {
    console.error("Error saving business data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
