import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>
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
    justifyContent: "center", // 🔹 Centraliza os quadradinhos verticalmente
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
    justifyContent: "center", // 🔹 Centraliza os quadradinhos horizontalmente
    gap: 15,
  },
  button: {
    backgroundColor: "#7a4f9e",
    width: "40%",
    height: 120,
    borderRadius: 15,
    margin: 8,
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
  bottomNav: { 
    height: 60, 
    borderTopWidth: 1, 
    borderTopColor: "#ddd", 
    backgroundColor: "#fff", 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 5,
  },
});