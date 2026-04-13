const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const buildAuthResponse = (user, message) => ({
  success: true,
  message,
  token: generateToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedName = name?.trim();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json(buildAuthResponse(user, "User registered successfully"));
  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    return res.status(200).json(buildAuthResponse(user, "Login successful"));
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile"
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const normalizedName = name?.trim();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedName || !normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: normalizedName,
        email: normalizedEmail
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile"
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
