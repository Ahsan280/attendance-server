import { Attendance } from "../model/attendance.model.js";

export const getStartAndEndOfDay = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

export const hasCheckedIn = async (date, userId) => {
  const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
  const attendance = await Attendance.findOne({
    user: userId,
    checkIn: { $gte: startOfDay, $lte: endOfDay },
  });
  return !!attendance;
};
export const hasCheckedOut = async (date, userId) => {
  const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
  const attendance = await Attendance.findOne({
    user: userId,
    checkOut: { $gte: startOfDay, $lte: endOfDay },
  });
  return !!attendance;
};
