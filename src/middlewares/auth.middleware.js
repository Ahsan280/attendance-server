import jwt from "jsonwebtoken";

import { generateAccessAndRefreshToken } from "../controllers/user.controller.js";
import { options } from "../constants.js";
import User from "../model/user.mysql.model.js";
export const isManager = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || !user.isManager) {
      return res.status(401).json({ message: "Unauthorized Manager Request" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const isManagerOrisOwner = async (req, res, next) => {
  try {
    const { id } = req.body;

    const user = await User.findById(req.user.id);
    const isOwner = user.id === id;
    if (!isOwner && !user.isManager) {
      return res.status(401).json({ message: "Unauthorized Manager Request" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!token) {
      console.log("Unauthorized Request No Token");
      return res.status(403).json({ message: "Logout True" });
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const { accessToken, refreshToken } = await refreshAccessToken(
          incomingRefreshToken
        );
        if (!accessToken || !refreshToken) {
          res.clearCookie("accessToken", options);
          res.clearCookie("refreshToken", options);
          return res
            .status(403)

            .json({ message: "Logout True" });
        }
        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);
        decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      }
    }

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res.status(401).json({ message: "Invalid access token user" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid access token catch" });
  }
};
const refreshAccessToken = async (incomingRefreshToken) => {
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user
    );
    return { accessToken, refreshToken };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { accessToken: null, refreshToken: null };
    }
  }
};
