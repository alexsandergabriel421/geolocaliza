import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Establishment = { id: number; name: string };

type Props = {
  establishments: Establishment[];
};

export default function EstablishmentList({ establishments }: Props) {
  return (
    <View style={styles.container}>
      {establishments.map((e) => (
        <Text key={e.id}>• {e.name}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
});
