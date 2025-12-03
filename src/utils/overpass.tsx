// utils/overpass.ts
export interface POI {
    id: number;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    address?: string;
  }
  
  export const fetchNearbyPOIs = async (
    lat: number,
    lng: number,
    radius = 500
  ): Promise<POI[]> => {
    // Query para padaria, supermercado, farmácia em um raio (meters)
    const query = `
    [out:json][timeout:25];
    (
      node["shop"="bakery"](around:${radius},${lat},${lng});
      node["shop"="supermarket"](around:${radius},${lat},${lng});
      node["amenity"="pharmacy"](around:${radius},${lat},${lng});
    );
    out body;
    `;
  
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    // Transformar resultado em array de POI
    const pois: POI[] = data.elements.map((el: any) => ({
      id: el.id,
      name: el.tags?.name || "Sem nome",
      type: el.tags?.shop || el.tags?.amenity || "desconhecido",
      latitude: el.lat,
      longitude: el.lon,
      address: el.tags?.addr_full || el.tags?.addr_street || "",
    }));
  
    return pois;
  };
  