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
import {
  deleteUserMySql,
  getAllUsersMySql,
  loginUserMySql,
  logoutUserMySql,
  registerUserMySql,
  updateUserMySql,
} from "../controllers/user.mysql.controller.js";
const userRouter = Router();

userRouter.route("/register").post(registerUserMySql);
userRouter.route("/login").post(loginUserMySql);
userRouter.route("/logout").post(isAuthenticated, logoutUserMySql);
userRouter
  .route("/all-users")
  .get(isAuthenticated, isManager, getAllUsersMySql);
userRouter.route("/make-manager").post(isAuthenticated, isManager, makeManager);
userRouter
  .route("/update-user")
  .post(isAuthenticated, isManagerOrisOwner, updateUserMySql);
userRouter
  .route("/delete-user")
  .post(isAuthenticated, isManagerOrisOwner, deleteUserMySql);
export default userRouter;
