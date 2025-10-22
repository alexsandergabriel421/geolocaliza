import React from "react";
import { LatLng } from "../utils/distance";

type Props = {
  establishment: { id: number; name: string; lat: number; lng: number };
  onClick?: (id: number) => void;
  isWeb?: boolean;
};

export default function EstablishmentMarker({ establishment, onClick, isWeb }: Props) {
  if (isWeb) {
    const { Marker, Popup } = require("react-leaflet");
    return (
      <Marker position={{ lat: establishment.lat, lng: establishment.lng }}>
        <Popup>{establishment.name}</Popup>
      </Marker>
    );
  }

  // Para mobile você pode criar cards ou um Marker do react-native-maps
  return null;
}
