const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      division,
      year,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !division ||
      !year
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Public signup ALWAYS creates a normal User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      division,
      year,
      role: "User",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        division: user.division,
        year: user.year,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        division: user.division,
        year: user.year,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
};