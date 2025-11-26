import { distanceBetween } from "./distance";

export const checkGeofence = (
  lat: number,
  lon: number,
  geofence: { latitude: number; longitude: number; radius: number }
) => {
  const distance = distanceBetween(
    { lat, lng: lon },
    { lat: geofence.latitude, lng: geofence.longitude }
  );

  return distance <= geofence.radius;
};
