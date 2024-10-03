import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Time extends Model {}

Time.init(
  {
    requiredCheckInTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Time",
    tableName: "times", // Name of the table in the database
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

export default Time;
