import React, { useEffect, useState } from "react";
import { LatLng, Establishment } from "../types";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";

// Raio
const geofenceRadius = 200;
const clickRadius = 150;

// Estabelecimentos
const nearbyEstablishments: Establishment[] = [
  { id: "1", name: "Padaria Central", lat: -23.5506, lng: -46.6331, description: "Melhor pão da cidade" },
  { id: "2", name: "Mercado São Paulo", lat: -23.5500, lng: -46.6335, description: "Produtos frescos e baratos" },
  { id: "3", name: "Farmácia Paulista", lat: -23.5508, lng: -46.6338, description: "Medicamentos e conveniência" },
];

// Centraliza mapa
function MoveToUser({ location }: { location: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 16);
  }, [location]);
  return null;
}

// Marcadores coloridos
const createMarkerIcon = (color: "green" | "red") =>
  new L.DivIcon({
    className: "custom-marker",
    html: `<div style="background-color:${color};width:20px;height:20px;border-radius:50%;border:2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

export default function MapScreenWeb() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [selected, setSelected] = useState<Establishment | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation?.watchPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
    return () => navigator.geolocation?.clearWatch(watchId!);
  }, []);

  const haversineDistance = (coord1: LatLng, coord2: LatLng) => {
    const R = 6371000;
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      {/* Mapa */}
      <div style={{ width: "100%", height: "100%" }}>
        <MapContainer center={location || { lat: -23.5505, lng: -46.6333 }} zoom={16} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Círculos do usuário */}
          {location && (
            <>
              <Circle center={location} radius={geofenceRadius} pathOptions={{ color: "blue", fillOpacity: 0.1 }} />
              <Circle center={location} radius={clickRadius} pathOptions={{ color: "green", fillOpacity: 0.2 }} />
              <Marker position={location} icon={createMarkerIcon("green")}></Marker>
            </>
          )}
          <MoveToUser location={location} />

          {/* Estabelecimentos */}
          {nearbyEstablishments.map((est) => {
            const distance = location ? haversineDistance(location, { lat: est.lat, lng: est.lng }) : 0;
            const color = distance <= clickRadius ? "green" : "red";
            return (
              <Marker
                key={est.id}
                position={{ lat: est.lat, lng: est.lng }}
                icon={createMarkerIcon(color)}
                eventHandlers={{ click: () => setSelected(est) }}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* Modal do estabelecimento */}
      {selected && (
        <div style={{
          position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)",
          background: "white", padding: 20, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
          {location && (
            <p>Distância: {Math.round(haversineDistance(location, { lat: selected.lat, lng: selected.lng }))} m</p>
          )}
          <button onClick={() => setSelected(null)}>Fechar</button>
        </div>
      )}
    </div>
  );
}
