import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 60, backgroundColor: "#6200ee", justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 20, fontWeight: "bold" },
});
