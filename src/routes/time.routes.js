import { Router } from "express";
import {
  changeTime,
  createTime,
  getTime,
} from "../controllers/time.controller.js";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware.js";
const timeRouter = Router();
timeRouter.route("/create-time").post(isAuthenticated, isManager, createTime);
timeRouter.route("/get-time").get(isAuthenticated, getTime);
timeRouter.route("/change-time").post(isAuthenticated, isManager, changeTime);

export default timeRouter;
