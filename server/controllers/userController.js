import jwt from "jsonwebtoken"; //this is need for sending back signed jwt
import bcrypt from "bcryptjs"; // this is to hash our passwords for security
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

//Register new user
//route: POST /api/users
//Public

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //check for any incomplete credentials
  if (!email || !username || !password) {
    req.status(400);
    throw new Error("Please add all fields");
  }
  // check if that username is already occupied
  const userNameExists = await User.findOne({ username });

  if (userNameExists) {
    res.status(400);
    throw new Error("Username already in use");
  }
  //check id has already been created by that id
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User aleady exists");
  }

  // Hash password for security reasons
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create User
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(200).json({
      _id: user.id,
      username: user.name,
      email: user.email,
      token: generateToken(user._id),
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

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      username: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// get user data
// GET /api/users/me
// Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//Generate token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
