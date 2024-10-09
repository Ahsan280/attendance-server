import bcrypt from "bcrypt";
import connection from "../db/index.js";
import jwt from "jsonwebtoken";

class User {
  constructor(userData) {
    this.id = userData.id;
    this.fullName = userData.fullName;
    this.email = userData.email;
    this.password = userData.password;
    this.phoneNumber = userData.phoneNumber;
    this.isManager = userData.isManager || false;
    this.refreshToken = userData.refreshToken || null;
    this.createdAt = userData.createdAt;
    this.updatedAt = userData.updatedAt;
  }

  // Create a new user (INSERT)
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const query = `
      INSERT INTO users (fullName, email, password, phoneNumber, isManager)
      VALUES (?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          userData.fullName,
          userData.email,
          hashedPassword,
          userData.phoneNumber,
          userData.isManager || false,
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results.insertId); // Return the new user's ID
        }
      );
    });
  }

  // Find a user by email (SELECT)
  static findByEmail(email) {
    const query =
      "SELECT id, fullName, email, phoneNumber, password, isManager, createdAt, updatedAt FROM users WHERE email = ?";

    return new Promise((resolve, reject) => {
      connection.query(query, [email], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(new User(results[0])); // Return a new instance of User
        } else {
          resolve(null);
        }
      });
    });
  }
  static findById(id) {
    const query =
      "SELECT id, fullName, email, phoneNumber, isManager, createdAt, updatedAt FROM users WHERE id = ?";
    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(new User(results[0]));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Update a user's phone number (UPDATE)
  static updateUserData(userId, fullName, email, phoneNumber) {
    const query = `UPDATE users SET phoneNumber = ?, fullName = ?, email = ? WHERE id = ?`;

    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [phoneNumber, fullName, email, userId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          connection.query(
            "SELECT id, fullName, email, phoneNumber, isManager, createdAt, updatedAt FROM users WHERE id = ?",
            [userId],
            (err, results) => {
              if (err) {
                return reject(err);
              }
              if (results.length > 0) {
                resolve(new User(results[0]));
              } else {
                resolve(null);
              }
            }
          );
        }
      );
    });
  }

  // Delete a user by ID (DELETE)
  static deleteById(userId) {
    const query = "DELETE FROM users WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(query, [userId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Check if the password is correct
  async isPasswordCorrect(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Generate Access Token
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

  // Generate Refresh Token
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

export default User;
