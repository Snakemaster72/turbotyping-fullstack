import jwt from "jsonwebtoken"; //this is need for sending back signed jwt
import bcrypt from "bcryptjs"; // this is to hash our passwords for security
import asyncHandler from "express-async-handler";
import crypto from 'crypto';
import { User } from "../models/userModel.js";
import sendEmail from '../utils/sendEmail.js';
import validator from 'validator';

//Register new user
//route: POST /api/users
//Public

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const registerUser = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;

  if (!email || !username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  if (username.length < 3 || username.length > 20) {
    res.status(400);
    throw new Error("Username must be 3-20 characters");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (@ $ ! % * ? &)");
  }

  email = validator.normalizeEmail(email);
  username = validator.escape(username);

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    if (existingEmail.isVerified) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }
    // Unverified account — refresh the token and resend the email
    const verificationToken = generateVerificationToken();
    existingEmail.verificationToken = verificationToken;
    existingEmail.verificationTokenExpires = new Date(Date.now() + 3600000);
    await existingEmail.save();
    try {
      await sendEmail({
        to: existingEmail.email,
        subject: 'Verify your TurboTyping account',
        type: 'verification',
        token: verificationToken
      });
    } catch (error) {
      console.error('Error resending verification email:', error);
      res.status(500);
      throw new Error('Failed to send verification email. Please check your spam folder or try again later.');
    }
    return res.status(200).json({
      message: "Verification email resent. Please check your inbox.",
    });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    res.status(400);
    throw new Error("This username is already taken");
  }

  const verificationToken = generateVerificationToken();
  const verificationTokenExpires = new Date(Date.now() + 3600000);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires,
    isVerified: false
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your TurboTyping account',
      type: 'verification',
      token: verificationToken
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    // Keep the user record so they can trigger a resend by re-submitting the form
    res.status(500);
    throw new Error('Account created but verification email failed to send. Try signing up again with the same email to resend it.');
  }

  res.status(201).json({
    _id: user.id,
    username: user.username,
    email: user.email,
    message: "Registration successful. Please check your email to verify your account.",
    token: generateToken(user._id)
  });
});

//login user
//route: POST /api/users/login
//Public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
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
