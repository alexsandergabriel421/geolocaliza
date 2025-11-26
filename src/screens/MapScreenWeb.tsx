import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrigir ícones padrão
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Haversine
function distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estabelecimentos
const establishments = [
  { id: 1, name: "Padaria Ki Sabor", type: "padaria", latitude: -23.54285, longitude: -46.41175, address: "Rua Antônio Carias, 10" },
  { id: 2, name: "Mercado Negreiros", type: "mercado", latitude: -23.54312, longitude: -46.41098, address: "Rua Antônio Carias, 20" },
  { id: 3, name: "DrogaLeste", type: "farmacia", latitude: -23.54355, longitude: -46.4124, address: "Rua Antônio Carias, 30" },
  { id: 4, name: "Bar do Carlão", type: "bar", latitude: -23.5439, longitude: -46.4112, address: "Rua Antônio Carias, 40" },
  { id: 5, name: "Lanchonete Ponto Certo", type: "lanchonete", latitude: -23.5424, longitude: -46.4105, address: "Rua Antônio Carias, 50" },
];

// Cores por tipo
const typeColors: { [key: string]: string } = {
  padaria: "#FFA500",
  mercado: "#34A853",
  farmacia: "#EA4335",
  bar: "#4285F4",
  lanchonete: "#FABB05",
};

// Criar marcador
const createMarkerIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color}; width:14px; height:14px; border-radius:7px; border:2px solid #fff;"></div>`,
  });

// Estilos modal
const modalOverlayStyle: React.CSSProperties = {
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

const modalContentStyle: React.CSSProperties = {
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
  touchAction: "none",
  position: "relative",
};

const modalContentOpenStyle: React.CSSProperties = {
  transform: "translateY(0%)",
};

const dragBarStyle: React.CSSProperties = {
  width: 50,
  height: 5,
  background: "#ccc",
  borderRadius: 3,
  margin: "0 auto 10px",
  cursor: "grab",
};

const modalTitleStyle: React.CSSProperties = { margin: 0, marginBottom: 6, fontSize: "1.4rem", fontWeight: 600, color: "#333" };
const modalAddressStyle: React.CSSProperties = { margin: 0, marginBottom: 6, fontSize: "1rem", color: "#555" };
const modalDistanceStyle: React.CSSProperties = { margin: 0, marginBottom: 15, fontSize: "0.95rem", color: "#777" };

const modalButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  border: "none",
  background: "#4285F4",
  color: "#fff",
  borderRadius: 8,
  fontSize: "0.95rem",
  cursor: "pointer",
  fontWeight: 500,
  margin: "5px",
};

export default function MapScreenWeb() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const clickRadius = 300;
  const ruaAntonioCarias = { lat: -23.5432, lng: -46.4110 };

  useEffect(() => {
    setLocation(ruaAntonioCarias);
  }, []);

  const handleMarkerClick = (store: any) => {
    setSelectedStore(store);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStore(null);
  };

  const distanceToStore = (store: any) =>
    Math.round(distanceBetween(location!.lat, location!.lng, store.latitude, store.longitude));

  // Drag start
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startYRef.current = e.clientY;
    modalRef.current?.setPointerCapture(e.pointerId);
  };

  // Drag move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!modalRef.current || startYRef.current === 0) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) {
      modalRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  // Drag end
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!modalRef.current || startYRef.current === 0) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 100) {
      closeModal();
    } else {
      modalRef.current.style.transform = "translateY(0)";
    }
    startYRef.current = 0;
    modalRef.current.releasePointerCapture(e.pointerId);
  };

  if (!location) return <p>Carregando mapa...</p>;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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

      {modalOpen && selectedStore && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div
            ref={modalRef}
            style={{ ...modalContentStyle, ...modalContentOpenStyle }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div style={dragBarStyle}></div>
            <h2 style={modalTitleStyle}>{selectedStore.name}</h2>
            <p style={modalAddressStyle}>{selectedStore.address}</p>
            <p style={modalDistanceStyle}>Distância: {distanceToStore(selectedStore)} metros</p>
            <div>
              <button
                style={modalButtonStyle}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedStore.latitude},${selectedStore.longitude}`,
                    "_blank"
                  )
                }
              >
                Como chegar
              </button>
              <button style={modalButtonStyle} onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
