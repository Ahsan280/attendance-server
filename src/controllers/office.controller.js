import Office from "../model/office.model.js";

const changeOfficeLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    let office = await Office.findOne();
    if (!office) {
      office = await Office.create({ latitude, longitude });
    }
    office.latitude = latitude;
    office.longitude = longitude;
    await office.save();
    res
      .status(200)
      .json({ office, message: "Office location updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating office location" });
  }
};
const getOfficeLocation = async (req, res) => {
  try {
    const office = await Office.findOne();
    if (!office) {
      return res.status(404).json({ message: "Office location not found" });
    }
    return res.status(200).json({ officeLocation: office });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving office location" });
  }
};
export { changeOfficeLocation, getOfficeLocation };
