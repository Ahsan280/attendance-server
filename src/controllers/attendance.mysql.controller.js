import Attendance from "../model/attendance.mysql.model.js";
import { Op } from "sequelize";
import {
  getStartAndEndOfDay,
  findAndUpdate,
  hasCheckedInMysql,
  hasCheckedOutMysql,
  validateCheckIn,
} from "../utils/index.mysql.js";
const calculateHoursWorked = (checkIn, checkOut) => {
  const diffMs = checkOut - checkIn;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);

  const hoursWorked = `${diffHrs}h ${diffMins}m`;
  return hoursWorked;
};
const checkInMySql = async (req, res) => {
  try {
    const { date, timezone, latitude, longitude } = req.body;

    const userId = req.user.id;
    if (!date) {
      console.log("Date is Required");
      return res.status(400).json({ error: "Date is required" });
    }
    if (await hasCheckedInMysql(date, userId)) {
      console.log("You have already checked In");
      return res
        .status(400)
        .json({ error: "You have already checked in today" });
    }

    const { allowCheckIn, shift, distance, radius } = await validateCheckIn(
      userId,
      date,
      timezone,
      { latitude, longitude }
    );
    if (!allowCheckIn) {
      if (distance) {
        console.log("DISTANCE......");
        return res.status(400).json({
          error: `You are not allowed to check in from this location. You are ${distance}m away`,
        });
      }

      console.log("TIME......");
      return res.status(400).json({
        error: `You are not allowed to check in at this time. Your shift is from ${shift.startTime} to ${shift.endTime}`,
      });
    }
    const attendance = await Attendance.create({
      user: userId,
      checkIn: date,
      timezone: timezone,
    });

    if (!attendance) {
      return res
        .status(500)
        .json({ error: "Something went wrong while checking in" });
    }
    return res
      .status(201)
      .json({ attendance, message: "Checked In Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while checking in" });
  }
};
const checkOutMySql = async (req, res) => {
  try {
    const { today, checkOut } = req.body;
    const { startOfDay, endOfDay } = getStartAndEndOfDay(today);

    const userId = req.user.id;
    if (!checkOut) {
      return res.status(400).json({ error: "Check out is required" });
    }
    if (await hasCheckedOutMysql(today, userId)) {
      return res
        .status(400)
        .json({ error: "You have already checked out today" });
    }
    const attendance = await findAndUpdate(
      Attendance,
      {
        user: userId,
        checkIn: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
      },
      { checkOut }
    );

    if (!attendance) {
      return res
        .status(404)
        .json({ error: "No attendance record found for the given date" });
    }
    const checkInTime = new Date(attendance.checkIn);
    const checkOutTime = new Date(checkOut);
    const hoursWorked = calculateHoursWorked(checkInTime, checkOutTime);

    await attendance.update({ hoursWorked });

    return res
      .status(200)
      .json({ attendance, message: "Checked Out Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while checking out" });
  }
};
const filterAttendancesByDateMySql = async (req, res) => {
  try {
    const { date } = req.params;
    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);

    const attendances = await Attendance.findAll({
      where: { checkIn: { [Op.gte]: startOfDay, [Op.lte]: endOfDay } },
    });
    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};
const filterAttendancesByDateUserMySql = async (req, res) => {
  try {
    const { date, id } = req.params;

    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
    const attendances = await Attendance.findOne({
      where: {
        checkIn: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
        user: id,
      },
    });

    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};

const filterAttendancesByUserMySql = async (req, res) => {
  try {
    const { id } = req.params;
    const attendances = await Attendance.findAll({ where: { user: id } });
    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};
const hasCheckedInEndpointMySql = async (req, res) => {
  try {
    const { date } = req.params;
    const checkedIn = await hasCheckedInMysql(date, req.user.id);
    return res.status(200).json({ checkedIn });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while checking if user has checked in",
    });
  }
};
const hasCheckedOutEndpointMySql = async (req, res) => {
  try {
    const { date } = req.params;
    const checkedOut = await hasCheckedOutMysql(date, req.user.id);
    return res.status(200).json({ checkedOut });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while checking if user has checked out",
    });
  }
};

export {
  checkInMySql,
  checkOutMySql,
  filterAttendancesByDateMySql,
  filterAttendancesByDateUserMySql,
  filterAttendancesByUserMySql,
  hasCheckedInEndpointMySql,
  hasCheckedOutEndpointMySql,
};
