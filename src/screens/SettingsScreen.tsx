import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function SettingsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text>Aqui você pode adicionar opções de configuração.</Text>
      <View style={{ height: 20 }} />
      <Button title="Voltar para Home" onPress={() => navigation.navigate("Home")} />
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
    marginBottom: 10,
  },
});
