import { getDistance, isPointWithinRadius } from "geolib";
import Office from "../model/office.model.js";

export const isWithinRequiredRadius = async (
  userLocation,

  radius = 100
) => {
  const office = await Office.findOne();
  if (!office) {
    throw new Error("Office not found");
  }
  const { latitude, longitude } = office;

  const distance = getDistance(userLocation, { latitude, longitude });
  const withinRadius = isPointWithinRadius(
    userLocation,
    { latitude, longitude },
    radius
  );
  return { distance, withinRadius, radius };
};
