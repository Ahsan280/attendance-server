import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  logoutUser,
  makeManager,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import {
  isAuthenticated,
  isManager,
  isManagerOrisOwner,
} from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(isAuthenticated, isManager, registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(isAuthenticated, logoutUser);
userRouter.route("/all-users").get(isAuthenticated, isManager, getAllUsers);
userRouter.route("/make-manager").post(isAuthenticated, isManager, makeManager);
userRouter
  .route("/update-user")
  .post(isAuthenticated, isManagerOrisOwner, updateUser);
userRouter
  .route("/delete-user")
  .post(isAuthenticated, isManagerOrisOwner, deleteUser);
export default userRouter;
