import Attendance from "../model/attendance.mysql.model.js";
import Application from "../model/application.mysql.model.js";
import { Op } from "sequelize";
import User from "../model/user.mysql.model.js";
const createApplicationMySql = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;
    if (!reason || !fromDate) {
      return res.status(400).json({ error: "Reason and date are required" });
    }

    const startDate = new Date(fromDate);
    const endDate = toDate ? new Date(toDate) : new Date(fromDate);
    if (startDate > endDate) {
      return res
        .status(400)
        .json({ error: `'From date' cannot be after 'To date'` });
    }

    const attendanceExists = await Attendance.findOne({
      where: {
        user: req.user.id,
        checkIn: {
          [Op.or]: [
            {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
            {
              [Op.gte]: startDate,
            },
          ],
        },
      },
    });

    if (attendanceExists) {
      return res
        .status(400)
        .json({ error: "You have already checked in on this date" });
    }
    const application = await Application.create({
      applicant: req.user.id,
      reason,
      fromDate,
      toDate: toDate ? toDate : fromDate,
    });
    return res
      .status(201)
      .json({ application, message: "Application created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while creating application" });
  }
};
const approveApplicationMySql = async (req, res) => {
  try {
    console.log("Inside approve application");
    const { applicationId } = req.body;

    const application = await Application.findByPk(applicationId);

    if (!application) {
      console.log("Application not found");
      return res.status(404).json({ error: "Application not found" });
    }
    const { applicant, fromDate, toDate } = application;
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    let attendances = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const checkInDate = new Date(date);
      attendances.push({
        user: applicant,
        checkIn: checkInDate,
        status: "leave",
      });
    }

    // Bulk create attendances
    const createdAttendances = await Attendance.bulkCreate(attendances);
    await application.destroy();
    return res.status(201).json({
      application,
      attendances,
      createdAttendances,
      message: "Application Approved",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while approving application" });
  }
};
const disapproveApplicationMySql = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const application = await Application.findByPk(applicationId);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    await application.destroy();
    return res
      .status(200)
      .json({ application, message: "Application Deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while disapproving application" });
  }
};
const getApplicationsMySql = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [{ model: User, as: "applicantUser" }],
    });
    return res.status(200).json({ applications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export {
  createApplicationMySql,
  approveApplicationMySql,
  disapproveApplicationMySql,
  getApplicationsMySql,
};
