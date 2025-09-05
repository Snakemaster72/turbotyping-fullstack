import jwt from "jsonwebtoken"; //this is need for sending back signed jwt
import bcrypt from "bcryptjs"; // this is to hash our passwords for security
import asyncHandler from "express-async-handler";
import crypto from 'crypto';
import { User } from "../models/userModel.js";
import sendEmail from '../utils/sendEmail.js';

//Register new user
//route: POST /api/users
//Public

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check for any incomplete credentials
  if (!email || !username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if username or email already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    res.status(400);
    throw new Error(
      existingUser.username === username 
        ? "Username already exists" 
        : "Email already exists"
    );
  }

  // Generate verification token
  const verificationToken = generateVerificationToken();
  const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires,
    isVerified: false
  });

  if (user) {
    // Generate verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your TurboTyping account',
        type: 'verification',
        token: verificationToken
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Delete the created user if email sending fails
      await User.findByIdAndDelete(user._id);
      res.status(500);
      throw new Error('Error sending verification email. Please try again.');
    }
    
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      message: "Registration successful. Please check your email to verify your account.",
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//login user
//route: POST /api/users/login
//Public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check for any incomplete credentials
  if (!email || !password) {
    req.status(400);
    throw new Error("Please add all fields");
  }

  //check id exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    res.status(400);
    throw new Error("Please verify your email before logging in");
  }

  if (await bcrypt.compare(password, user.password)) {
    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// get user data
// GET /api/users/me
// Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password"); // Find user by ID, exclude password
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Verify email
// GET /api/users/verify-email/:token
// Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Find user by verification token and check if it's expired
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token");
  }

  // Update user verification status
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    message: "Email verified successfully. You can now log in."
  });
});

//Generate token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
