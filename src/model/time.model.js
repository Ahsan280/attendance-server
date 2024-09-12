import mongoose, { Schema } from "mongoose";
const timeSchema = new Schema(
  {
    requiredCheckInTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Time = mongoose.model("Time", timeSchema);
