const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/indiProduct.js");
const nodemailer = require("nodemailer");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST: Add a new product
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { name, email, description, price, quantity } = req.body;
    const images = req.files.map((file) => file.path);

    const product = new Product({
      name,
      email,
      description,
      price,
      quantity,
      images,
    });
    await product.save();

    // Sending email with product details
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use another service like 'SMTP' if necessary
      auth: {
        user: "raghavdixit008@gmail.com",
        pass: "kkrh suln tcww xmwg",
      },
    });

    const mailOptions = {
      from: email,
      to: "raghavdixit008@gmail.com", // Or another recipient's email
      subject: `New Product Submission: ${name}`,
      text: `
        A new product has been submitted with the following details:
        
        Product Name: ${name}
        Description: ${description}
        Price: ${price}
        Quantity: ${quantity}

        Images: ${images.join(", ")}

        Regards,
        Your Company
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Product saved successfully", product });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
