// src/components/Footer.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Localiza App © 2025</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 50, justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
  text: { fontSize: 14 }
});
