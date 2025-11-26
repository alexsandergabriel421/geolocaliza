// src/components/StoreCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StoreCard({ store, distance, onPress }) {
  const handlePhonePress = () => {
    if (!store.phone) return;
    let url = "";
    if (Platform.OS === "web") {
      url = `tel:${store.phone}`;
      window.open(url);
    } else {
      url = `tel:${store.phone}`;
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Ionicons name="location-sharp" size={22} color="#ff5722" />
        <Text style={styles.title}>{store.name}</Text>
      </View>

      {/* Endereço */}
      {store.address && <Text style={styles.address}>{store.address}</Text>}

      {/* Distância */}
      {distance !== undefined && (
        <View style={styles.row}>
          <Ionicons name="walk" size={18} color="#555" />
          <Text style={styles.distance}>{(distance / 1000).toFixed(1)} km de você</Text>
        </View>
      )}

      {/* Telefone */}
      {store.phone && (
        <TouchableOpacity style={styles.row} onPress={handlePhonePress}>
          <Ionicons name="call" size={18} color="#555" />
          <Text style={styles.phone}>{store.phone}</Text>
        </TouchableOpacity>
      )}

      {/* Status aberto/fechado */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: store.isOpen ? "green" : "red" },
          ]}
        />
        <Text style={styles.statusText}>
          {store.isOpen ? "Aberto agora" : "Fechado"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 6,
  },
  address: {
    color: "#555",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  distance: {
    marginLeft: 6,
    color: "#333",
  },
  phone: {
    marginLeft: 6,
    textDecorationLine: "underline",
    color: "#4285F4",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    marginRight: 6,
  },
  statusText: {
    fontWeight: "500",
  },
});
