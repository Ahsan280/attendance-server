import { DataTypes, Model } from "sequelize";
import Time from "./time.mysql.model.js";
import moment from "moment-timezone";
import sequelize from "../db/index.js";
import Shift from "./shift.mysql.model.js";

class Attendance extends Model {}

Attendance.init(
  {
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
    },
    timezone: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "late", "leave"),
      defaultValue: "present",
    },
    hoursWorked: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Attendance",
    timestamps: true,
    hooks: {
      beforeSave: async (attendance, options) => {
        if (attendance.status === "leave") return;
        if (!attendance.changed("checkIn")) return;
        const userTimeZone = attendance.timezone || "UTC";
        const shift = await Shift.findOne({ where: { user: attendance.user } });
        console.log("Time Zone Before", userTimeZone);
        const checkedInTime = moment(attendance.checkIn)
          .tz(userTimeZone)
          .format("HH:mm");

        const startTimePlus30 = moment(shift.startTime, "HH:mm")
          .add(30, "minutes")
          .format("HH:mm");

        if (
          moment(checkedInTime, "HH:mm").isAfter(
            moment(startTimePlus30, "HH:mm")
          )
        ) {
          attendance.status = "late";
        }
      },
    },
  }
);

export default Attendance;
