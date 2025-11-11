// models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], // Array of image paths
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("indiProduct", productSchema);

module.exports = Product;
