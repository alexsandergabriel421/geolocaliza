import React from "react";
import { Platform } from "react-native";

type Props = {
  establishment: { id: number; name: string; lat: number; lng: number; distance?: number };
  onClick?: (id: number) => void;
};

export default function EstablishmentMarker({ establishment, onClick }: Props) {
  // --- WEB (Leaflet) ---
  if (Platform.OS === "web") {
    const { Marker, Popup } = require("react-leaflet");

    return (
      <Marker
        position={{ lat: establishment.lat, lng: establishment.lng }}
        eventHandlers={{ click: () => onClick && onClick(establishment.id) }}
      >
        <Popup>
          <strong>{establishment.name}</strong>
          {establishment.distance !== undefined && (
            <p>{Math.round(establishment.distance)} m</p>
          )}
        </Popup>
      </Marker>
    );
  }

  // --- MOBILE (react-native-maps) ---
  const { Marker: RNMarker } = require("react-native-maps");

  return (
    <RNMarker
      coordinate={{ latitude: establishment.lat, longitude: establishment.lng }}
      onPress={() => onClick && onClick(establishment.id)}
      pinColor="red"
    />
  );
}
