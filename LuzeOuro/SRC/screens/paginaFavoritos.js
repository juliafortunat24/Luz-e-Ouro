import React, { useState, useEffect } from "react"; 
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';

export default function PaginaFavoritos({ route, navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const routeAtual = useRoute();
  const currentScreen = routeAtual.name;

  useEffect(() => { carregarFavoritos(); }, []);
  useEffect(() => {
    if (route.params?.produto) { adicionarFavorito(route.params.produto); }
  }, [route.params?.produto]);

  const carregarFavoritos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@favoritos");
      if (jsonValue) setFavoritos(JSON.parse(jsonValue));
    } catch (e) { console.log("Erro ao carregar favoritos:", e); }
  };

  const salvarFavoritos = async (itens) => {
    try { await AsyncStorage.setItem("@favoritos", JSON.stringify(itens)); }
    catch (e) { console.log("Erro ao salvar favoritos:", e); }
  };

  const adicionarFavorito = async (novo) => {
    try {
      const jsonValue = await AsyncStorage.getItem("@favoritos");
      const listaAtual = jsonValue ? JSON.parse(jsonValue) : [];
      if (listaAtual.some((item) => item.id === novo.id)) return;
      const atualizados = [...listaAtual, novo];
      setFavoritos(atualizados);
      await salvarFavoritos(atualizados);
    } catch (e) { console.log("Erro ao adicionar favorito:", e); }
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
      {/* Header (igual ao da Página de Filtros) */}
<View style={styles.header}>
  <View style={styles.logoContainer}>
    <Image
      source={{ uri: 'https://via.placeholder.com/30/8a2be2/ffffff?text=L' }}
      style={styles.logoImage}
    />
    <View>
      <Text style={styles.logoText}>Luz e Ouro</Text>
      <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
    </View>
  </View>
  <TouchableOpacity>
    <Ionicons name="chatbubble-outline" size={24} color="#666" />
  </TouchableOpacity>
</View>


      <View style={styles.topRow}>
        <Text style={styles.title}>{favoritos.length} Itens Favoritados</Text>
        {favoritos.length > 0 && (
          <TouchableOpacity onPress={limparTudo}>
            <Text style={styles.clearText}>Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>

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

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("PaginaInicial")}
      >
        <Text style={styles.continueText}>Continuar explorando</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons
            name={currentScreen === "PaginaInicial" ? "home" : "home-outline"}
            size={26}
            color={currentScreen === "PaginaInicial" ? "#7a4f9e" : "#333"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons
            name={currentScreen === "PaginaFiltros" ? "search" : "search-outline"}
            size={26}
            color={currentScreen === "PaginaFiltros" ? "#7a4f9e" : "#333"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons
            name={currentScreen === "PaginaFavoritos" ? "heart" : "heart-outline"}
            size={26}
            color={currentScreen === "PaginaFavoritos" ? "#7a4f9e" : "#333"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons
            name={currentScreen === "PaginaCarrinho" ? "cart" : "cart-outline"}
            size={26}
            color={currentScreen === "PaginaCarrinho" ? "#7a4f9e" : "#333"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons
            name={currentScreen === "PaginaPerfil" ? "person" : "person-outline"}
            size={26}
            color={currentScreen === "PaginaPerfil" ? "#7a4f9e" : "#333"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 10,
  paddingTop: 45, // mesmo espaçamento da página de filtros
  backgroundColor: '#fff',
},
logoContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
logoImage: {
  width: 35,
  height: 35,
  borderRadius: 5,
  marginRight: 10,
  backgroundColor: '#7a4f9e',
},
logoText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
logoSubtitle: {
  fontSize: 12,
  color: '#666',
  marginTop: -3,
},

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
    marginHorizontal: 16,
    marginBottom: 80, // 🔹 Alterado para subir o botão acima do bottom nav
    alignItems: "center",
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  bottomNav: { 
    height: 60, 
    borderTopWidth: 1, 
    borderTopColor: "#ddd", 
    backgroundColor: "#fff", 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center", 
    paddingBottom: 5,
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { flex: 1, alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#999", fontSize: 15 },
});