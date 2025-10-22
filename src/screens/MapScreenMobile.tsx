import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

const geofenceRadius = 200;
const clickRadius = 200;

const nearbyEstablishments = [
  { id: "1", name: "Padaria Central", latitude: -23.5506, longitude: -46.6331 },
  { id: "2", name: "Mercado São Paulo", latitude: -23.5500, longitude: -46.6335 },
  { id: "3", name: "Farmácia Paulista", latitude: -23.5508, longitude: -46.6338 },
];

const haversineDistance = (coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }) => {
  const R = 6371000;
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLng = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MapScreenMobile() {
  const [location, setLocation] = useState({ latitude: -23.5505, longitude: -46.6333 });
  const [nearbyList, setNearbyList] = useState<typeof nearbyEstablishments>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const current = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setLocation(current);

        const nearby = nearbyEstablishments.filter(
          (est) => haversineDistance(current, { latitude: est.latitude, longitude: est.longitude }) <= clickRadius
        );
        setNearbyList(nearby);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
      >
        {/* Círculos na posição do usuário */}
        <Circle center={location} radius={geofenceRadius} strokeColor="blue" fillColor="rgba(0,0,255,0.1)" />
        <Circle center={location} radius={clickRadius} strokeColor="green" fillColor="rgba(0,255,0,0.2)" />

        {/* Estabelecimentos */}
        {nearbyEstablishments.map((est) => {
          const distance = haversineDistance(location, { latitude: est.latitude, longitude: est.longitude });
          const pinColor = distance <= clickRadius ? "green" : "red";
          return <Marker key={est.id} coordinate={{ latitude: est.latitude, longitude: est.longitude }} pinColor={pinColor} title={est.name} />;
        })}
      </MapView>

      {/* Lista flutuante no rodapé */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Estabelecimentos próximos (50m)</Text>
        {nearbyList.length === 0 ? (
          <Text style={styles.noNearby}>Nenhum estabelecimento próximo</Text>
        ) : (
          <FlatList
            data={nearbyList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const distance = Math.round(haversineDistance(location, { latitude: item.latitude, longitude: item.longitude }));
              return <Text style={styles.listItem}>{item.name} - {distance} m</Text>;
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: Dimensions.get("window").height * 0.3,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
  },
  listTitle: { fontWeight: "bold", marginBottom: 5 },
  noNearby: { fontStyle: "italic" },
  listItem: { paddingVertical: 2 },
});
