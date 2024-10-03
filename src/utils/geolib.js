import { getDistance, isPointWithinRadius } from "geolib";

export const isWithinRequiredRadius = (
  userLocation,
  officeLocation = {
    latitude: 33.60357598866281,
    longitude: 73.02644145326552,
  },
  radius = 100
) => {
  const distance = getDistance(userLocation, officeLocation);
  const withinRadius = isPointWithinRadius(
    userLocation,
    officeLocation,
    radius
  );
  return { distance, withinRadius, radius };
};
