import connection from "../db/index.js"; // Import the MySQL connection

class Shift {
  constructor(shiftData) {
    this.id = shiftData.id;
    this.user = shiftData.user;
    this.startTime = shiftData.startTime;
    this.endTime = shiftData.endTime;
    this.shiftType = shiftData.shiftType;
  }

  // Create a new shift (INSERT)
  static create(shiftData) {
    const query = `
      INSERT INTO shifts (user, startTime, endTime, shiftType) 
      VALUES (?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          shiftData.user,
          shiftData.startTime,
          shiftData.endTime,
          shiftData.shiftType,
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          const newShiftId = results.insertId;
          const selectQuery = `SELECT * FROM shifts WHERE id = ?`;
          const newShift = connection.query(
            selectQuery,
            [newShiftId],
            (err, shiftResults) => {
              if (err) {
                return reject(err);
              }
              if (shiftResults.length > 0) {
                resolve(new Shift(shiftResults[0])); // Return the newly created Shift object
              } else {
                resolve(null); // Handle case where the shift was not found
              }
            }
          );

          resolve(results.insertId); // Return the new shift's ID
        }
      );
    });
  }

  // Find a shift by ID (SELECT)
  static findById(id) {
    const query = "SELECT * FROM shifts WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(new Shift(results[0])); // Return a new instance of Shift
        } else {
          resolve(null);
        }
      });
    });
  }
  // Find a shift by custom command
  static findWhere(custom, value) {
    const query = `SELECT * FROM shifts WHERE ${custom} = ?`;
    return new Promise((resolve, reject) => {
      connection.query(query, [value], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(new Shift(results[0])); // Return an array of Shift objects
        } else {
          resolve([]);
        }
      });
    });
  }

  // Update a shift (UPDATE)
  static updateById(id, updatedData) {
    const query = `
      UPDATE shifts 
      SET user = ?, startTime = ?, endTime = ?, shiftType = ? 
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          updatedData.user,
          updatedData.startTime,
          updatedData.endTime,
          updatedData.shiftType,
          id,
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  // Delete a shift by ID (DELETE)
  static deleteById(id) {
    const query = "DELETE FROM shifts WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Get all shifts (SELECT)
  static findAll() {
    const query = "SELECT * FROM shifts";

    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.map((row) => new Shift(row))); // Return an array of Shift instances
      });
    });
  }
}

export default Shift;
