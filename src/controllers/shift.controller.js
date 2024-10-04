import Shift from "../model/shift.mysql.model.js";

const assignShift = async (req, res) => {
  try {
    const { userId, startTime, endTime, shiftType } = req.body;

    if (!userId || !startTime || !endTime || !shiftType) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const shiftExists = await Shift.findOne({ where: { user: userId } });

    if (shiftExists) {
      shiftExists.startTime = startTime;
      shiftExists.endTime = endTime;
      shiftExists.shiftType = shiftType;
      await shiftExists.save();
      return res.status(200).json({
        shift: shiftExists,
        message: "Already existing shift updated",
      });
    }
    const newShift = await Shift.create({
      user: userId,
      startTime,
      endTime,
      shiftType,
    });
    if (!newShift) {
      return res.status(500).json({ message: "Error creating shift" });
    }
    return res.status(201).json({ shift: newShift, message: "Shift created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getShift = async (req, res) => {
  try {
    const { user } = req.params;
    if (!user) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const shift = await Shift.findOne({ where: { user } });
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    return res.status(200).json({ shift });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export { assignShift, getShift };
