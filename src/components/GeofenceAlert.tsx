import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  inside: boolean;
};

export default function GeofenceAlert({ inside }: Props) {
  return (
    <View style={styles.container}>
      <Text>{inside ? "Você está dentro da área!" : "Você está fora da área!"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
});
