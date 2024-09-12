import mongoose, { Schema } from "mongoose";
import moment from "moment";
import { Time } from "./time.model.js";
const attendanceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      default: "present",
    },
    checkOut: {
      type: Date,
    },
    hoursWorked: {
      type: String,
    },
  },
  { timestamps: true }
);
attendanceSchema.pre("save", async function (next) {
  if (this.status === "leave") return next();
  if (!this.isModified("checkIn")) return next();
  console.log("AFter is Modified");
  const attendance = this;
  const time = await Time.findOne();
  const checkedInTime = moment(attendance.checkIn).format("HH:mm");
  const requiredCheckInTime = moment
    .utc(time.requiredCheckInTime, "HH:mm")
    .format("HH:mm");

  if (
    moment(checkedInTime, "HH:mm").isAfter(
      moment(time.requiredCheckInTime, "HH:mm")
    )
  ) {
    attendance.status = "late";
  }
  next();
});
export const Attendance = mongoose.model("Attendance", attendanceSchema);
