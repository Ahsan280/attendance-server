import Attendance from "../model/attendance.mysql.model.js";
import { Op, where } from "sequelize";
import moment from "moment-timezone";
import Shift from "../model/shift.mysql.model.js";
import { isWithinRequiredRadius } from "./geolib.js";
export const getStartAndEndOfDay = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

export const hasCheckedInMysql = async (date, userId) => {
  const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
  const attendance = await Attendance.findOne({
    where: {
      user: userId,
      checkIn: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      },
    },
  });
  return !!attendance;
};

export const hasCheckedOutMysql = async (date, userId) => {
  const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
  const attendance = await Attendance.findOne({
    where: {
      user: userId,
      checkOut: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      },
    },
  });
  return !!attendance;
};
const checkToAllowCheckIn = function (checkedInTime, shift, userLocation) {
  const checkIn = moment(checkedInTime, "HH:mm:ss");
  const start = moment(shift.startTime, "HH:mm:ss");
  const end = moment(shift.endTime, "HH:mm:ss");

  if (shift.shiftType === "remote") {
    const allowCheckIn = checkIn.isBetween(start, end, null, "[]");
    return { allowCheckIn };
  }
  const { distance, withinRadius, radius } =
    isWithinRequiredRadius(userLocation);
  const allowCheckIn =
    withinRadius && checkIn.isBetween(start, end, null, "[]");
  return { allowCheckIn, distance, radius };
};
export const validateCheckIn = async (
  userId,
  checkIn,
  timezone,
  userLocation
) => {
  const shift = await Shift.findOne({ where: { user: userId } });
  console.log(shift.shiftType);
  if (!shift) return true;
  const userTimeZone = timezone || "UTC";

  const checkedInTime = moment(checkIn).tz(userTimeZone).format("HH:mm");

  const { allowCheckIn, distance } = checkToAllowCheckIn(
    checkedInTime,
    shift,
    userLocation
  );
  return { allowCheckIn, distance, shift };
};
export const findAndUpdate = async (model, conditions, updateValues) => {
  try {
    const record = await model.findOne({ where: conditions });
    if (record) {
      await record.update(updateValues);
      return record;
    }
  } catch (error) {
    throw error;
  }
};
