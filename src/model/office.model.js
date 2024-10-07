import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";
class Office extends Model {}
Office.init(
  {
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Office",
    timestamps: true,
  }
);
export default Office;
