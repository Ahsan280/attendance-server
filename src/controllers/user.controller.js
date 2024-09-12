import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { options } from "../constants.js";
const generateAccessAndRefreshToken = async (user) => {
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  return { accessToken, refreshToken };
};

const makeManager = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { isManager: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res
      .status(200)
      .json({ user, message: "User made manager successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while making manager" });
  }
};
const registerUser = async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;
  if (!fullName || !email || !password || !phoneNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const alreadyExists = await User.findOne({ email });

  if (alreadyExists) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }
  const user = await User.create({ fullName, email, password, phoneNumber });
  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createduser) {
    return res
      .status(500)
      .json({ error: "Something went wrong while creating user" });
  }

  return res
    .status(201)
    .json({ createduser, message: "User created successfully" });
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "User with this email does not exist" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        accessToken,
        refreshToken,
        message: "Logged in successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while logging in" });
  }
};
const logoutUser = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User Logged Out successfully" });
};

const updateUser = async (req, res) => {
  try {
    const { id, fullName, email, phoneNumber } = req.body;

    if (!id || !fullName || !email || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({
        error: "Invalid email format. Please use a valid email address.",
      });
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phoneNumber,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res
      .status(200)
      .json({ updatedUser: user, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      deletedUser: user,
      message:
        id === req.user._id ? "Logout True" : "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while deleting user" });
  }
};
const getAllUsers = async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
};
export {
  registerUser,
  loginUser,
  logoutUser,
  generateAccessAndRefreshToken,
  getAllUsers,
  makeManager,
  updateUser,
  deleteUser,
};
