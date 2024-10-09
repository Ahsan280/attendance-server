import connection from "../db/index.js";

class Application {
  static async create(applicationData) {
    const insertQuery = `
      INSERT INTO application (applicant, reason, fromDate, toDate) 
      VALUES (?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [
          applicationData.applicant,
          applicationData.reason,
          applicationData.fromDate,
          applicationData.toDate,
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          // Fetch and return the newly created application record
          const newApplicationId = results.insertId;
          const selectQuery = `SELECT * FROM application WHERE id = ?`;
          connection.query(
            selectQuery,
            [newApplicationId],
            (err, appResults) => {
              if (err) return reject(err);
              if (appResults.length > 0) {
                resolve(appResults[0]);
              } else {
                resolve(null);
              }
            }
          );
        }
      );
    });
  }

  static async findById(id) {
    const selectQuery = `SELECT * FROM application WHERE id = ?`;
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

  static async update(id, applicationData) {
    const updateQuery = `
      UPDATE application 
      SET applicant = ?, reason = ?, fromDate = ?, toDate = ? 
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      connection.query(
        updateQuery,
        [
          applicationData.applicant,
          applicationData.reason,
          applicationData.fromDate,
          applicationData.toDate,
          id,
        ],
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
    const deleteQuery = `DELETE FROM application WHERE id = ?`;
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

export default Application;
