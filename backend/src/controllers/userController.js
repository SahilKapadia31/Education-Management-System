const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Helper function to handle errors
const handleError = (res, error, message = "Server Error", statusCode = 500) => {
  console.error(error);
  res.status(statusCode).json({ message });
};

// Register a new user as a Student by default
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user with default role "Student"
    const user = new User({ name, email, password: hashedPassword, role: "Student" });
    await user.save();

    // Generate token and respond
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    handleError(res, error);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token and respond
    const token = generateToken(user);
    res.status(200).json({
      token,
      id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Admin creates a new Teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and save user with role "Teacher"
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: "Teacher" });
    await user.save();

    res.status(201).json({ message: "Teacher created successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch all teachers (Admin only)
exports.fetchAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "Teacher" }).select("-password");
    res.status(200).json(teachers);
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch all students (Admin or Teacher)
exports.fetchAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "Student" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    handleError(res, error);
  }
};
