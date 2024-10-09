// import connection from "../db/index.js";

// class Time {
//   constructor(timeData) {
//     this.requiredCheckInTime = timeData.requiredCheckInTime;
//   }

//   // Create a new time entry (INSERT)
//   static create(timeData) {
//     const query = `
//       INSERT INTO times (requiredCheckInTime)
//       VALUES (?)
//     `;

//     return new Promise((resolve, reject) => {
//       connection.query(
//         query,
//         [timeData.requiredCheckInTime],
//         (err, results) => {
//           if (err) {
//             return reject(err);
//           }
//           resolve(results.insertId); // Return the new time entry's ID
//         }
//       );
//     });
//   }

//   // Find a time entry by ID (SELECT)
//   static findById(id) {
//     const query = "SELECT * FROM times WHERE id = ?";

//     return new Promise((resolve, reject) => {
//       connection.query(query, [id], (err, results) => {
//         if (err) {
//           return reject(err);
//         }
//         if (results.length > 0) {
//           resolve(new Time(results[0])); // Return a new instance of Time
//         } else {
//           resolve(null);
//         }
//       });
//     });
//   }

//   // Update a time entry's check-in time (UPDATE)
//   static updateCheckInTime(id, newCheckInTime) {
//     const query = "UPDATE times SET requiredCheckInTime = ? WHERE id = ?";

//     return new Promise((resolve, reject) => {
//       connection.query(query, [newCheckInTime, id], (err, results) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(results);
//       });
//     });
//   }

//   // Delete a time entry by ID (DELETE)
//   static deleteById(id) {
//     const query = "DELETE FROM times WHERE id = ?";

//     return new Promise((resolve, reject) => {
//       connection.query(query, [id], (err, results) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(results);
//       });
//     });
//   }

//   // Get all time entries (SELECT)
//   static findAll() {
//     const query = "SELECT * FROM times";

//     return new Promise((resolve, reject) => {
//       connection.query(query, (err, results) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(results.map((row) => new Time(row))); // Return an array of Time instances
//       });
//     });
//   }
// }

// export { Time };
