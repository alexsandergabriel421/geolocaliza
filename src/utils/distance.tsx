export type LatLng = { lat: number; lng: number };

export function distanceBetween(loc1: LatLng, loc2: LatLng) {
  const R = 6371000; // metros
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isInsideGeofence(user: LatLng, center: LatLng, radius: number) {
  return distanceBetween(user, center) <= radius;
}
