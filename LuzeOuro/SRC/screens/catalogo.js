import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PaginaCatalogo({ navigation }) {
  const catalogItems = [
    { id: "1", name: "Colares", icon: "necklace", screen: "PaginaColares" },
    { id: "2", name: "Anéis", icon: "diamond", screen: "PaginaAneis" },
    { id: "3", name: "Relógios", icon: "clock", screen: "PaginaRelogios" },
    { id: "4", name: "Brincos", icon: "crown", screen: "PaginaBrincos" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo</Text>
      <View style={styles.grid}>
        {catalogItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.button}
            onPress={() => navigation.navigate(item.screen)}
          >
            <MaterialCommunityIcons name={item.icon} size={40} color="#fff" />
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#7a4f9e",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#7a4f9e",
    width: "48%",
    height: 120,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});