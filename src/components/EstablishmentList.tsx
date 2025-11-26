import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Establishment = { 
  id: number; 
  name: string; 
  address?: string;
  distance?: number 
};

type Props = {
  establishments: Establishment[];
  onSelect?: (id: number) => void;
};

export default function EstablishmentList({ establishments, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {establishments.map((e) => (
        <TouchableOpacity key={e.id} onPress={() => onSelect && onSelect(e.id)}>
          <View style={styles.item}>
            <Text style={styles.name}>• {e.name}</Text>

            {e.address && (
              <Text style={styles.address}>{e.address}</Text>
            )}

            {e.distance !== undefined && (
              <Text style={styles.distance}>
                {Math.round(e.distance)} m
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  address: { fontSize: 14, color: "#333", marginTop: 2 },
  distance: { fontSize: 14, color: "#666", marginTop: 2 },
});
