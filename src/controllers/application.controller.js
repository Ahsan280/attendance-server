import { Application } from "../model/application.model.js";
import { Attendance } from "../model/attendance.model.js";
const createApplication = async (req, res) => {
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
    const attendanceExists = await Attendance.find({
      user: req.user._id,
      $or: [
        { checkIn: { $gte: startDate } },
        { checkIn: { $gte: startDate, $lte: endDate } },
      ],
    });
    if (attendanceExists.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already checked in on this date" });
    }
    const application = await Application.create({
      applicant: req.user._id,
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
const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const application = await Application.findByIdAndDelete(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    const { applicant, fromDate, toDate } = application;
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    let attendances = [];
    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      attendances.push(
        await Attendance.create({
          user: applicant,
          checkIn: date,
          status: "leave",
        })
      );
    }
    return res
      .status(201)
      .json({ application, attendances, message: "Application Approved" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while approving application" });
  }
};
const disapproveApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const application = await Application.findByIdAndDelete(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
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
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("applicant");
    return res.status(200).json({ applications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export {
  createApplication,
  approveApplication,
  getApplications,
  disapproveApplication,
};
