import connection from "../db/index.js";

class Office {
  static async create(officeData) {
    const insertQuery = `
      INSERT INTO office (latitude, longitude) 
      VALUES (?, ?)
    `;

    return new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [officeData.latitude, officeData.longitude],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          // Fetch and return the newly created office record
          const newOfficeId = results.insertId;
          const selectQuery = `SELECT * FROM office WHERE id = ?`;
          connection.query(selectQuery, [newOfficeId], (err, officeResults) => {
            if (err) return reject(err);
            if (officeResults.length > 0) {
              resolve(officeResults[0]);
            } else {
              resolve(null);
            }
          });
        }
      );
    });
  }

  static async findById(id) {
    const selectQuery = `SELECT * FROM office WHERE id = ?`;
    return new Promise((resolve, reject) => {
      connection.query(selectQuery, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async update(id, officeData) {
    const updateQuery = `
      UPDATE office 
      SET latitude = ?, longitude = ? 
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      connection.query(
        updateQuery,
        [officeData.latitude, officeData.longitude, id],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static async delete(id) {
    const deleteQuery = `DELETE FROM office WHERE id = ?`;
    return new Promise((resolve, reject) => {
      connection.query(deleteQuery, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }
}

export default Office;
