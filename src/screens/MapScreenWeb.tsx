import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreCard from "../components/StoreCard";
import { distanceBetween, formatDistance, LatLng } from "../utils/distance";
import { getCurrentLocation } from "../utils/geolocation";

// Corrige ícones padrão
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Cores por tipo
const typeColors: Record<string, string> = {
  bakery: "#FFA500",
  supermarket: "#34A853",
  pharmacy: "#EA4335",
  bar: "#4285F4",
  cafe: "#FABB05",
};

const createMarkerIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color}; width:16px; height:16px; border-radius:8px; border:2px solid #fff;"></div>`,
  });

export default function MapScreenWeb() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const fallbackStores = (loc: LatLng) => [
    { id: 1, name: "Padaria Local", type: "bakery", lat: loc.lat + 0.0005, lon: loc.lng + 0.0005, address: "Rua A", phone: "1111-1111" },
    { id: 2, name: "Mercado Vizinho", type: "supermarket", lat: loc.lat - 0.0005, lon: loc.lng - 0.0004, address: "Rua B", phone: "2222-2222" },
    { id: 3, name: "Farmácia Central", type: "pharmacy", lat: loc.lat + 0.0007, lon: loc.lng - 0.0006, address: "Rua C", phone: "3333-3333" },
    { id: 4, name: "Barzinho da Esquina", type: "bar", lat: loc.lat - 0.0006, lon: loc.lng + 0.0005, address: "Rua D", phone: "4444-4444" },
    { id: 5, name: "Café do Bairro", type: "cafe", lat: loc.lat + 0.0003, lon: loc.lng + 0.0007, address: "Rua E", phone: "5555-5555" },
  ];

  useEffect(() => {
    async function init() {
      const loc = await getCurrentLocation();
      if (loc) {
        setLocation(loc);
        setPlaces(fallbackStores(loc)); // garante que sempre tenha 5 lojas próximas
      }
    }
    init();
  }, []);

  if (!location) return <div>Carregando mapa...</div>;

  const distanceToStore = (store: any) =>
    distanceBetween(location.lat, location.lng, store.lat || store.latitude, store.lon || store.longitude);

  const handleMarkerClick = (store: any) => {
    setSelectedStore(store);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStore(null);
  };

  const handlePointerDown = (e: any) => {
    startYRef.current = e.clientY;
    modalRef.current?.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: any) => {
    if (!startYRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) modalRef.current!.style.transform = `translateY(${deltaY}px)`;
  };
  const handlePointerUp = (e: any) => {
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 100) closeModal();
    else modalRef.current!.style.transform = "translateY(0)";
    startYRef.current = 0;
    modalRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer center={[location.lat, location.lng]} zoom={17} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle center={[location.lat, location.lng]} radius={200} pathOptions={{ color: "blue" }} />
        <Marker position={[location.lat, location.lng]} icon={createMarkerIcon("green")} />
        {places.map((store) => (
          <Marker
            key={store.id}
            position={[store.lat || store.latitude, store.lon || store.longitude]}
            icon={createMarkerIcon(typeColors[store.type] || "#000")}
            eventHandlers={{ click: () => handleMarkerClick(store) }}
          />
        ))}
      </MapContainer>

      {modalOpen && selectedStore && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div
            ref={modalRef}
            style={{ ...modalContentStyle, ...modalContentOpenStyle }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={dragBarStyle}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
            <StoreCard
              store={selectedStore}
              distance={formatDistance(distanceToStore(selectedStore))}
              onPress={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat || selectedStore.latitude},${selectedStore.lon || selectedStore.longitude}`,
                  "_blank"
                )
              }
            />
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          maxHeight: 250,
          overflowY: "scroll",
          padding: 10,
          background: "rgba(255,255,255,0.9)",
        }}
      >
        {places.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            distance={formatDistance(distanceToStore(store))}
            onPress={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${store.lat || store.latitude},${store.lon || store.longitude}`,
                "_blank"
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

// Estilos do modal
const modalOverlayStyle = {
  position: "fixed" as "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 1000,
};
const modalContentStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: "15px 15px 0 0",
  minWidth: 300,
  maxWidth: 360,
  boxShadow: "0 -6px 25px rgba(0,0,0,0.3)",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
  transform: "translateY(100%)",
  transition: "transform 0.3s ease-out",
  position: "relative" as "relative",
};
const modalContentOpenStyle = { transform: "translateY(0%)" };
const dragBarStyle = { width: 50, height: 5, background: "#ccc", borderRadius: 3, margin: "0 auto 10px", cursor: "grab" };
