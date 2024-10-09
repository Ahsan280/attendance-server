import User from "../model/user.mysql.model.js";
import { options } from "../constants.js";
const generateAccessAndRefreshToken = async (user) => {
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  return { accessToken, refreshToken };
};
const registerUserMySql = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;
    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const alreadyExists = await User.findByEmail(email);
    if (alreadyExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      isManager: false,
    });
    const createdUser = await User.findById(user);
    if (!createdUser) {
      return res
        .status(500)
        .json({ error: "Something went wrong while creating user" });
    }

    return res
      .status(201)
      .json({ createdUser, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const loginUserMySql = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findByEmail(email);
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

const logoutUserMySql = async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User Logged Out successfully" });
};
const updateUserMySql = async (req, res) => {
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
    console.log("Update User Data");
    const updatedUser = await User.updateUserData(
      id,
      fullName,
      email,
      phoneNumber
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ updatedUser, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while updating user" });
  }
};
const getAllUsersMySql = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password", "refreshToken"] },
  });
  return res.status(200).json(users);
};
const deleteUserMySql = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });
    const affectedRows = await User.destroy({ where: { id } });
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
export {
  registerUserMySql,
  loginUserMySql,
  logoutUserMySql,
  updateUserMySql,
  getAllUsersMySql,
  deleteUserMySql,
};
