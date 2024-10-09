import connection from "../db/index.js";
import moment from "moment-timezone";
import Shift from "./shift.mysql.model.js";

class Attendance {
  static async create(attendanceData) {
    const insertQuery = `
      INSERT INTO attendance 
      (user, checkIn, checkOut, timezone, status, hoursWorked, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [
          attendanceData.user,
          attendanceData.checkIn,
          attendanceData.checkOut || null,
          attendanceData.timezone || "UTC",
          attendanceData.status || "present",
          attendanceData.hoursWorked || null,
          attendanceData.latitude || null,
          attendanceData.longitude || null,
        ],
        async (err, results) => {
          if (err) {
            return reject(err);
          }

          const newAttendanceId = results.insertId;
          // Fetch and return the newly created attendance record
          const selectQuery = `SELECT * FROM attendance WHERE id = ?`;
          connection.query(
            selectQuery,
            [newAttendanceId],
            async (err, attendanceResults) => {
              if (err) return reject(err);
              if (attendanceResults.length > 0) {
                const attendance = attendanceResults[0];
                await Attendance.handleLateStatus(attendance); // Handle late status
                resolve(attendance);
              } else {
                resolve(null);
              }
            }
          );
        }
      );
    });
  }

  static async handleLateStatus(attendance) {
    if (attendance.status === "leave") return;

    const userTimeZone = attendance.timezone || "UTC";
    const shift = await Shift.findByUser(attendance.user);

    const checkedInTime = moment(attendance.checkIn)
      .tz(userTimeZone)
      .format("HH:mm");

    const startTimePlus30 = moment(shift.startTime, "HH:mm")
      .add(30, "minutes")
      .format("HH:mm");

    if (
      moment(checkedInTime, "HH:mm").isAfter(moment(startTimePlus30, "HH:mm"))
    ) {
      // Update status to "late" if the user checks in late
      const updateQuery = `UPDATE attendance SET status = ? WHERE id = ?`;
      connection.query(updateQuery, ["late", attendance.id], (err) => {
        if (err) {
          console.error("Error updating attendance status to 'late':", err);
        } else {
          attendance.status = "late";
        }
      });
    }
  }

  static findByUser(userId) {
    const selectQuery = `SELECT * FROM attendance WHERE user = ?`;
    return new Promise((resolve, reject) => {
      connection.query(selectQuery, [userId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}

export default Attendance;
