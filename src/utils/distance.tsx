export type LatLng = { lat: number; lng: number };

// DISTÂNCIA DEFINITIVA
export const distanceBetween = (
  p1: LatLng | number,
  p2?: LatLng | number,
  p3?: number,
  p4?: number
): number => {
  let lat1: number, lon1: number, lat2: number, lon2: number;

  // Caso seja object {lat,lng}, {lat,lng}
  if (typeof p1 === "object" && typeof p2 === "object") {
    lat1 = p1.lat;
    lon1 = p1.lng;
    lat2 = (p2 as LatLng).lat;
    lon2 = (p2 as LatLng).lng;
  } 
  // Caso seja object {lat,lng} + números
  else if (typeof p1 === "object" && typeof p2 === "number" && typeof p3 === "number") {
    lat1 = p1.lat;
    lon1 = p1.lng;
    lat2 = p2;
    lon2 = p3;
  } 
  // Caso seja números separados
  else if (typeof p1 === "number" && typeof p2 === "number" && typeof p3 === "number" && typeof p4 === "number") {
    lat1 = p1;
    lon1 = p2;
    lat2 = p3;
    lon2 = p4;
  } else {
    // Qualquer outra forma retorna 0
    return 0;
  }

  // Proteção contra NaN
  if ([lat1, lon1, lat2, lon2].some((v) => v == null || isNaN(v))) return 0;

  const R = 6371000; // metros
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Formata distância
export const formatDistance = (meters: number) => {
  if (!meters || isNaN(meters)) return "0 m";
  if (meters < 1000) return `${Math.round(meters)} m`;
  if (meters < 10000) return `${(meters / 1000).toFixed(2)} km`;
  return `${(meters / 1000).toFixed(1)} km`;
};
