const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const signupRoutes = require("./routes/signup");
const signinRoutes = require("./routes/signin");
const signoutRoutes = require("./routes/signout");
const productRoutes = require("./routes/indi_pro");
const businessRoutes = require("./routes/business_pro");

const app = express();
const PORT = 8001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use("/api/products", productRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/signup", signupRoutes);
app.use("/signin", signinRoutes);
app.use("/signout", signoutRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
