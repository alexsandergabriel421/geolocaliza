import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App de Localização!</Text>
      <Button title="Ir para o Mapa" onPress={() => navigation.navigate("Map")} />
      <View style={{ height: 20 }} />
      <Button title="Configurações" onPress={() => navigation.navigate("Settings")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
