import mongoose from "mongoose";
import { Attendance } from "../model/attendance.model.js";
import {
  hasCheckedIn,
  getStartAndEndOfDay,
  hasCheckedOut,
} from "../utils/index.js";

const checkIn = async (req, res) => {
  try {
    const { date, timezone } = req.body;

    const userId = req.user._id;
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }
    if (await hasCheckedIn(date, userId)) {
      return res
        .status(400)
        .json({ error: "You have already checked in today" });
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
const calculateHoursWorked = (checkIn, checkOut) => {
  const diffMs = checkOut - checkIn;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);

  const hoursWorked = `${diffHrs}h ${diffMins}m`;
  return hoursWorked;
};
const checkOut = async (req, res) => {
  try {
    const { today, checkOut } = req.body;
    const { startOfDay, endOfDay } = getStartAndEndOfDay(today);

    const userId = req.user._id;
    if (!checkOut) {
      return res.status(400).json({ error: "Check out is required" });
    }
    if (await hasCheckedOut(today, userId)) {
      return res
        .status(400)
        .json({ error: "You have already checked out today" });
    }
    const attendance = await Attendance.findOneAndUpdate(
      { user: userId, checkIn: { $gte: startOfDay, $lte: endOfDay } },
      { checkOut: checkOut },
      { new: true }
    );
    if (!attendance) {
      return res
        .status(404)
        .json({ error: "No attendance record found for the given date" });
    }
    const checkInTime = new Date(attendance.checkIn);
    const checkOutTime = new Date(checkOut);
    const hoursWorked = calculateHoursWorked(checkInTime, checkOutTime);

    attendance.hoursWorked = hoursWorked;
    await attendance.save({ validateBeforeSave: false });
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
const filterAttendancesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);

    const attendances = await Attendance.find({
      checkIn: { $gte: startOfDay, $lte: endOfDay },
    });
    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};
const filterAttendancesByDateUser = async (req, res) => {
  try {
    const { date, id } = req.params;

    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
    const attendances = await Attendance.findOne({
      checkIn: { $gte: startOfDay, $lte: endOfDay },
      user: id,
    });

    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};
const filterAttendancesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const attendances = await Attendance.find({ user: id });
    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};
const filterAttendancesByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }
    const attendances = await Attendance.aggregate([
      {
        $addFields: {
          month: { $month: "$checkIn" },
          year: { $year: "$checkIn" },
        },
      },
      { $match: { month: parseInt(month, 10), year: parseInt(year, 10) } },
    ]);
    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};
const filterAttendancesByMonthUser = async (req, res) => {
  try {
    const { month, year, id } = req.params;
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }
    const attendances = await Attendance.aggregate([
      {
        $addFields: {
          month: { $month: "$checkIn" },
          year: { $year: "$checkIn" },
        },
      },
      {
        $match: {
          month: parseInt(month, 10),
          year: parseInt(year, 10),
          user: new mongoose.Types.ObjectId(id),
        },
      },
    ]);
    return res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while filtering attendances" });
  }
};

const hasCheckedInEndpoint = async (req, res) => {
  try {
    const { date } = req.params;
    const checkedIn = await hasCheckedIn(date, req.user._id);
    return res.status(200).json({ checkedIn });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while checking if user has checked in",
    });
  }
};
const hasCheckedOutEndpoint = async (req, res) => {
  try {
    const { date } = req.params;
    const checkedOut = await hasCheckedOut(date, req.user._id);
    return res.status(200).json({ checkedOut });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while checking if user has checked out",
    });
  }
};

export {
  checkIn,
  checkOut,
  filterAttendancesByDate,
  filterAttendancesByUser,
  filterAttendancesByDateUser,
  filterAttendancesByMonth,
  filterAttendancesByMonthUser,
  hasCheckedInEndpoint,
  hasCheckedOutEndpoint,
};
