import { Router } from "express";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware.js";
import {
  changeOfficeLocation,
  getOfficeLocation,
} from "../controllers/office.controller.js";
const officeRouter = Router();

officeRouter
  .route("/change-office-location")
  .post(isAuthenticated, isManager, changeOfficeLocation);

officeRouter.route("/get-office-location").get(getOfficeLocation);
export default officeRouter;
