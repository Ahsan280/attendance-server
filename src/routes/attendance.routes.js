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
import {
  checkInMySql,
  checkOutMySql,
  filterAttendancesByDateMySql,
  filterAttendancesByDateUserMySql,
  filterAttendancesByUserMySql,
  hasCheckedInEndpointMySql,
  hasCheckedOutEndpointMySql,
} from "../controllers/attendance.mysql.controller.js";
const attendanceRouter = Router();
attendanceRouter.route("/check-in").post(isAuthenticated, checkInMySql);
attendanceRouter.route("/check-out").post(isAuthenticated, checkOutMySql);
attendanceRouter
  .route("/filter-by-date/:date")
  .get(isAuthenticated, isManager, filterAttendancesByDateMySql);
attendanceRouter
  .route("/filter-by-date-user/:date/:id")
  .get(isAuthenticated, filterAttendancesByDateUserMySql);
attendanceRouter
  .route("/filter-by-user/:id")
  .get(isAuthenticated, filterAttendancesByUserMySql);

attendanceRouter
  .route("/filter-by-month/:month/:year")
  .get(isAuthenticated, isManager, filterAttendancesByMonth);
attendanceRouter
  .route("/filter-by-month-user/:month/:year/:id")
  .get(isAuthenticated, filterAttendancesByMonthUser);
attendanceRouter
  .route("/has-checked-in/:date")
  .get(isAuthenticated, hasCheckedInEndpointMySql);
attendanceRouter
  .route("/has-checked-out/:date")
  .get(isAuthenticated, hasCheckedOutEndpointMySql);
export default attendanceRouter;
