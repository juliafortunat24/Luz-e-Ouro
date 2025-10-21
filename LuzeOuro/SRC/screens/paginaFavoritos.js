import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function PaginaFavoritos({ route, navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  // 🔹 Carrega os favoritos salvos ao abrir a tela
  useEffect(() => {
    carregarFavoritos();
  }, []);

  // 🔹 Se veio um novo produto da rota, adiciona e salva
  useEffect(() => {
    if (route.params?.produto) {
      adicionarFavorito(route.params.produto);
    }
  }, [route.params?.produto]);

  // === Funções ===

  const carregarFavoritos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@favoritos");
      if (jsonValue) setFavoritos(JSON.parse(jsonValue));
    } catch (e) {
      console.log("Erro ao carregar favoritos:", e);
    }
  };

  const salvarFavoritos = async (itens) => {
    try {
      await AsyncStorage.setItem("@favoritos", JSON.stringify(itens));
    } catch (e) {
      console.log("Erro ao salvar favoritos:", e);
    }
  };

  const adicionarFavorito = async (novo) => {
    try {
      // Pega os favoritos atuais do AsyncStorage
      const jsonValue = await AsyncStorage.getItem("@favoritos");
      const listaAtual = jsonValue ? JSON.parse(jsonValue) : [];

      // Verifica se já existe
      const jaExiste = listaAtual.some((item) => item.id === novo.id);
      if (jaExiste) return; // Evita duplicatas

      const atualizados = [...listaAtual, novo];
      setFavoritos(atualizados);
      await salvarFavoritos(atualizados);
    } catch (e) {
      console.log("Erro ao adicionar favorito:", e);
    }
  };

  const removerItem = async (id) => {
    const atualizados = favoritos.filter((item) => item.id !== id);
    setFavoritos(atualizados);
    await salvarFavoritos(atualizados);
  };

  const limparTudo = async () => {
    setFavoritos([]);
    await AsyncStorage.removeItem("@favoritos");
  };

  // === Renderização ===

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => removerItem(item.id)} style={styles.trashButton}>
        <Ionicons name="trash-outline" size={20} color="#7a4f9e" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="diamond-stone" size={24} color="#7a4f9e" />
          <View>
            <Text style={styles.logoTitle}>Luz e Ouro</Text>
            <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
        <Ionicons name="chatbubbles-outline" size={22} color="#7a4f9e" />
      </View>

      {/* Título e limpar tudo */}
      <View style={styles.topRow}>
        <Text style={styles.title}>{favoritos.length} Itens Favoritados</Text>
        {favoritos.length > 0 && (
          <TouchableOpacity onPress={limparTudo}>
            <Text style={styles.clearText}>Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {favoritos.length > 0 ? (
        <FlatList
          data={favoritos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum item favoritado ainda 💜</Text>
        </View>
      )}

      {/* Botão continuar */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("PaginaInicial")}
      >
        <Text style={styles.continueText}>Continuar explorando</Text>
      </TouchableOpacity>

      {/* Navegação inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart" size={26} color="#7a4f9e" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// === Estilos ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  logoContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoTitle: { color: "#7a4f9e", fontWeight: "bold" },
  logoSubtitle: { color: "#777", fontSize: 12 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#333" },
  clearText: { color: "#7a4f9e", fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 80 },
  card: {
    backgroundColor: "#f8f5fb",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  info: { marginLeft: 10, flex: 1 },
  type: { fontSize: 12, color: "#777" },
  name: { fontSize: 15, fontWeight: "bold", color: "#333" },
  price: { fontSize: 14, color: "#7a4f9e", fontWeight: "600" },
  trashButton: { padding: 6 },
  continueButton: {
    backgroundColor: "#7a4f9e",
    padding: 14,
    borderRadius: 12,
    margin: 16,
    alignItems: "center",
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#999", fontSize: 15 },
});