import { Router } from "express";

import { isAuthenticated, isManager } from "../middlewares/auth.middleware.js";
import {
  approveApplication,
  createApplication,
  disapproveApplication,
  getApplications,
} from "../controllers/application.controller.js";
const applicationRouter = Router();
applicationRouter
  .route("/create-appilcation")
  .post(isAuthenticated, createApplication);
applicationRouter
  .route("/approve-appilcation")
  .post(isAuthenticated, isManager, approveApplication);
  applicationRouter
  .route("/disapprove-appilcation")
  .post(isAuthenticated, isManager, disapproveApplication);
applicationRouter
  .route("/get-applications")
  .get(isAuthenticated, isManager, getApplications);
export default applicationRouter;
