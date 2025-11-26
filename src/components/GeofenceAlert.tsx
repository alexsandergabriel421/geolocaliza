import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = { inside: boolean };

export default function GeofenceAlert({ inside }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: inside ? "#c8f7c5" : "#f8d7da" }]}>
      <Text style={{ color: inside ? "#1c7c1a" : "#721c24", fontWeight: "bold" }}>
        {inside ? "✔ Dentro da área permitida" : "✖ Fora da área!"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
});
