const userModel = require("../models/usermodels");
const generateToken = require("../utils/generatetoken");

// GET: fetch all customers
const fetchcustomers = async (req, res) => {
  try {
    const customers = await userModel.find();

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    console.error("Error in fetchcustomers:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching customers",
    });
  }
};

// POST: admin login (PLAIN TEXT PASSWORD VERSION)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Debug logs (you can remove later)
    console.log("Login attempt:");
    console.log(" email from body:", email);
    console.log(" email from env :", process.env.ADMIN_EMAIL);
    console.log(" password from body:", password);
    console.log(" password from env :", process.env.ADMIN_PASSWORD);

    // Check email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // PLAIN TEXT PASSWORD CHECK (matches ADMIN_PASSWORD=1234)
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken({ email });

    return res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { fetchcustomers, adminLogin };
