import { distanceBetween } from "./distance";

export const checkGeofence = (
  lat: number,
  lon: number,
  geofence: { latitude: number; longitude: number; radius: number }
) => {
  const distance = distanceBetween(
    lat,
    lon,
    geofence.latitude,
    geofence.longitude
  );

  return distance <= geofence.radius;
};
