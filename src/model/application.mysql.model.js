import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Application extends Model {}

Application.init(
  {
    applicant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    toDate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Application",
    timestamps: true,
  }
);

export default Application;
