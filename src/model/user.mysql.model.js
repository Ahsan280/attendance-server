import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sequelize from "../db/index.js";

class User extends Model {
  async isPasswordCorrect(password) {
    return await bcrypt.compare(password, this.password);
  }
  generateAccessToken() {
    return jwt.sign(
      {
        _id: this.id,
        fullName: this.fullName,
        phoneNumber: this.phoneNumber,
        isManager: this.isManager,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  }
  generateRefreshToken() {
    return jwt.sign(
      {
        _id: this.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  }
}
User.init(
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isManager: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

export default User;
