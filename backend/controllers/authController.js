const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const registerUser = async (req, res) => {

  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    })
  }

  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user" // default role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        rating: newUser.rating,
        role: newUser.role
      }
    });

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: error.message
    })
  }
};


// ================= LOGIN =================
const loginUser = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
        role: user.role
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }

};


// ================= PROFILE =================
const getProfile = async (req, res) => {

  const user = req.user;

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    rating: user.rating,
    role: user.role
  });

};


module.exports = { registerUser, loginUser, getProfile };