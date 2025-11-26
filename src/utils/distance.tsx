export type LatLng = { lat: number; lng: number };

/** Haversine padrão, correto, SEM alteração */
export function distanceBetween(loc1: LatLng, loc2: LatLng) {
  const R = 6371000; // metros
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);

  const lat1 = toRad(loc1.lat);
  const lat2 = toRad(loc2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // metros
}

/** Geofence simples usando a mesma fórmula */
export function isInsideGeofence(
  user: LatLng,
  center: LatLng,
  radius: number
) {
  return distanceBetween(user, center) <= radius;
}
