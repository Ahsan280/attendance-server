import { Router } from "express";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware.js";
import { assignShift, getShift } from "../controllers/shift.controller.js";
const shiftRouter = Router();

shiftRouter
  .route("/assign-shift")
  .post(isAuthenticated, isManager, assignShift);
shiftRouter.route("/get-shift/:user").get(isAuthenticated, getShift);
export default shiftRouter;
