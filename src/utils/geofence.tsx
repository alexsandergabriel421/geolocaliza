export const checkGeofence = (
  lat: number,
  lon: number,
  geofence: { latitude: number; longitude: number; radius: number }
) => {
  const R = 6371e3;
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (geofence.latitude * Math.PI) / 180;
  const Δφ = ((geofence.latitude - lat) * Math.PI) / 180;
  const Δλ = ((geofence.longitude - lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= geofence.radius;
};
