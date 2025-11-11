// models/Business.js

const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    categories: {
      type: [String], // Array of categories
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    locations: {
      type: String,
      required: true,
    },
    inventoryImages: {
      type: [String], // Array of image paths
      required: true,
    },
    bankDetails: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
