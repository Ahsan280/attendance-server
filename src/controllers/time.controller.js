// import { Time } from "../model/time.model.js";

const createTime = async (req, res) => {
  try {
    const { requiredCheckInTime } = req.body;
    const alreadyExists = await Time.findOne();
    if (alreadyExists) {
      return res.status(400).json({ error: "Time already exists" });
    }

    const time = await Time.create({ requiredCheckInTime });
    return res.status(201).json(time);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
const changeTime = async (req, res) => {
  try {
    const { requiredCheckInTime } = req.body;

    const time = await Time.findOne();
    if (!time) {
      return res.status(400).json({ error: "Time not found" });
    }
    time.requiredCheckInTime = requiredCheckInTime;
    await time.save();
    return res.status(200).json({ time: time });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while changing time" });
  }
};
const getTime = async (req, res) => {
  try {
    const time = await Time.findOne();
    if (!time) {
      return res.status(400).json({ error: "Time not found" });
    }

    return res.status(200).json({ time });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while getting time" });
  }
};
export { createTime, getTime, changeTime };
