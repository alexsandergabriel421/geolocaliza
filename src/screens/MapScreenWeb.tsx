import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreCard from "../components/StoreCard";

// ===== CORRIGE ÍCONES DO LEAFLET =====
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// ===== CALCULAR DISTÂNCIA =====
function distanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ===== ESTABELECIMENTOS =====
const establishments = [
  { id: 1, name: "Padaria Ki Sabor", type: "padaria", latitude: -23.54285, longitude: -46.41175, address: "Rua A, 10", phone: "1111-1111", isOpen: true },
  { id: 2, name: "Mercado Negreiros", type: "mercado", latitude: -23.54312, longitude: -46.41098, address: "Rua B, 20", phone: "2222-2222", isOpen: false },
  { id: 3, name: "DrogaLeste", type: "farmacia", latitude: -23.54355, longitude: -46.4124, address: "Rua C, 30", phone: "3333-3333", isOpen: true },
  { id: 4, name: "Bar do Carlão", type: "bar", latitude: -23.5439, longitude: -46.4112, address: "Rua D, 40", phone: "4444-4444", isOpen: false },
  { id: 5, name: "Lanchonete Ponto Certo", type: "lanchonete", latitude: -23.5424, longitude: -46.4105, address: "Rua E, 50", phone: "5555-5555", isOpen: true },
];

// ===== CORES =====
const typeColors = {
  padaria: "#FFA500",
  mercado: "#34A853",
  farmacia: "#EA4335",
  bar: "#4285F4",
  lanchonete: "#FABB05",
};

// ===== MARCADOR COLORIDO =====
const createMarkerIcon = (color) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color}; width:14px; height:14px; border-radius:7px; border:2px solid #fff;"></div>`,
  });

// ===== ESTILOS DO MODAL =====
const modalOverlayStyle = {
  position: "fixed",
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
  position: "relative",
};

const modalContentOpenStyle = {
  transform: "translateY(0%)",
};

const dragBarStyle = {
  width: 50,
  height: 5,
  background: "#ccc",
  borderRadius: 3,
  margin: "0 auto 10px",
  cursor: "grab",
};

export default function MapScreenWeb() {
  const [location, setLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const modalRef = useRef(null);
  const startYRef = useRef(0);

  const ruaAntonioCarias = { lat: -23.5432, lng: -46.4110 };
  const clickRadius = 300;

  useEffect(() => {
    setLocation(ruaAntonioCarias);
  }, []);

  const handleMarkerClick = (store) => {
    setSelectedStore(store);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStore(null);
  };

  const distanceToStore = (store) => {
    return Math.round(distanceBetween(location.lat, location.lng, store.latitude, store.longitude));
  };

  const handlePointerDown = (e) => {
    startYRef.current = e.clientY;
    modalRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!startYRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) modalRef.current.style.transform = `translateY(${deltaY}px)`;
  };

  const handlePointerUp = (e) => {
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 100) closeModal();
    else modalRef.current.style.transform = "translateY(0)";
    startYRef.current = 0;
    modalRef.current.releasePointerCapture(e.pointerId);
  };

  if (!location) return <p>Carregando mapa...</p>;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer center={[location.lat, location.lng]} zoom={17} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle center={[location.lat, location.lng]} radius={clickRadius} pathOptions={{ color: "blue" }} />
        <Marker position={[location.lat, location.lng]} icon={createMarkerIcon("green")} />
        {establishments.map((est) => (
          <Marker
            key={est.id}
            position={[est.latitude, est.longitude]}
            icon={createMarkerIcon(typeColors[est.type])}
            eventHandlers={{ click: () => handleMarkerClick(est) }}
          />
        ))}
      </MapContainer>

      {/* MODAL COM STORECARD */}
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
            ></div>

            <StoreCard
              store={selectedStore}
              distance={distanceToStore(selectedStore)}
              onPress={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${selectedStore.latitude},${selectedStore.longitude}`,
                  "_blank"
                )
              }
            />
          </div>
        </div>
      )}

      {/* LISTA ROLÁVEL ABAIXO */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          maxHeight: "250px",
          overflowY: "scroll",
          padding: 10,
          background: "rgba(255,255,255,0.9)",
        }}
      >
        {establishments.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            distance={distanceToStore(store)}
            onPress={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`,
                "_blank"
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
