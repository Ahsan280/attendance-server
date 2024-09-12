import { Router } from "express";
import {
  checkIn,
  checkOut,
  filterAttendancesByDate,
  filterAttendancesByDateUser,
  filterAttendancesByMonth,
  filterAttendancesByMonthUser,
  filterAttendancesByUser,
  hasCheckedInEndpoint,
  hasCheckedOutEndpoint,
} from "../controllers/attendance.controller.js";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware.js";
const attendanceRouter = Router();
attendanceRouter.route("/check-in").post(isAuthenticated, checkIn);
attendanceRouter.route("/check-out").post(isAuthenticated, checkOut);
attendanceRouter
  .route("/filter-by-date/:date")
  .get(isAuthenticated, isManager, filterAttendancesByDate);
attendanceRouter
  .route("/filter-by-date-user/:date/:id")
  .get(isAuthenticated, filterAttendancesByDateUser);
attendanceRouter
  .route("/filter-by-user/:id")
  .get(isAuthenticated, filterAttendancesByUser);

attendanceRouter
  .route("/filter-by-month/:month/:year")
  .get(isAuthenticated, isManager, filterAttendancesByMonth);
attendanceRouter
  .route("/filter-by-month-user/:month/:year/:id")
  .get(isAuthenticated, filterAttendancesByMonthUser);
attendanceRouter
  .route("/has-checked-in/:date")
  .get(isAuthenticated, hasCheckedInEndpoint);
attendanceRouter
  .route("/has-checked-out/:date")
  .get(isAuthenticated, hasCheckedOutEndpoint);
export default attendanceRouter;
