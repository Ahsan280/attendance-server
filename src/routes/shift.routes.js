import { Router } from "express";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware.js";
import { assignShift } from "../controllers/shift.controller.js";
const shiftRouter = Router();

shiftRouter
  .route("/assign-shift")
  .post(isAuthenticated, isManager, assignShift);
export default shiftRouter;
