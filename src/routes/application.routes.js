import { Router } from "express";

import { isAuthenticated, isManager } from "../middlewares/auth.middleware.js";
import {
  approveApplication,
  createApplication,
  disapproveApplication,
  getApplications,
} from "../controllers/application.controller.js";
import {
  approveApplicationMySql,
  createApplicationMySql,
  disapproveApplicationMySql,
  getApplicationsMySql,
} from "../controllers/application.mysql.controller.js";
const applicationRouter = Router();
applicationRouter
  .route("/create-appilcation")
  .post(isAuthenticated, createApplicationMySql);
applicationRouter
  .route("/approve-appilcation")
  .post(isAuthenticated, isManager, approveApplicationMySql);
applicationRouter
  .route("/disapprove-appilcation")
  .post(isAuthenticated, isManager, disapproveApplicationMySql);
applicationRouter
  .route("/get-applications")
  .get(isAuthenticated, isManager, getApplicationsMySql);
export default applicationRouter;
