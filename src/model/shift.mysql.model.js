import { Model, DataTypes } from "sequelize";
import sequelize from "../db/index.js";

class Shift extends Model {}
Shift.init(
  {
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    shiftType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Shift",
    timestamps: true,
  }
);
export default Shift;
