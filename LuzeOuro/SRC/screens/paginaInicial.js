import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';

const categories = [
  { id: "1", name: "Anéis", icon: "diamond", screen: "PaginaAneis" },
  { id: "2", name: "Colares", icon: "star", screen: "PaginaColares" },
  { id: "3", name: "Relógios", icon: "clock", screen: "PaginaRelogios" },
  { id: "4", name: "Brincos", icon: "crown", screen: "PaginaBrincos" },
];

const featuredProducts = [
  { id: "1", type: "Ouro", name: "Colar de ouro Elegante", price: "R$ 309,90", image: "https://cdn.awsli.com.br/600x450/940/940346/produto/198470554/colar-choker-fita-slim-8d612c0eb6.jpg" },
  { id: "2", type: "Ouro", name: "Colar com pingente", price: "R$ 320,90", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7b8qO9G1H8P9jgseoeCSRLfRj796LEFzSgg&s" },
  { id: "3", type: "Prata", name: "Anel Cravejado", price: "R$ 540,90", image: "https://cdn.iset.io/assets/40180/produtos/3624/anel-balaozinho-prata-cravejado-aparador-em-prata-925-an153-1-2.jpg" },
  { id: "4", type: "Ouro Branco", name: "Anel com Turmalina", price: "R$ 1.090,90", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHcZlJUe0vFNCs3NM_rg1Iu2Ka7SoTgAUbfQ&s" },
  { id: "5", type: "Ouro", name: "Brinco Brilhante", price: "R$ 200,90", image: "https://images.tcdn.com.br/img/img_prod/1002469/brinco_bola_dourado_com_strass_558272_2_c2099a80b2b263f8c862d4f3f768ce07.jpg" },
   { id: "6", type: "Prata", name: "Brinco de Estrela", price: "R$ 200,90", image: "https://images.tcdn.com.br/img/img_prod/754400/brinco_de_estrela_vazada_prata_925_13361_1_cd8ab73390310927498a4b1ca479a36f.jpg" },
];

const launches = [
  { id: "6", type: "Ouro Branco", name: "Anel com Turmalina", price: "R$ 1.090,90", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHcZlJUe0vFNCs3NM_rg1Iu2Ka7SoTgAUbfQ&s" },
];

export default function App({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Pega usuário logado do Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={{ margin: 10, alignItems: "center" }}
      onPress={() => navigation.navigate(item.screen)}
    >
      <MaterialCommunityIcons name={item.icon} size={24} color="#7a4f9e" />
      <Text style={{ color: "#7a4f9e", marginTop: 5 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />

      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => {
          toggleFavorite(item.id);
          navigation.navigate("PaginaFavoritos", { produto: item });
        }}
      >
        <Ionicons
          name={favorites.includes(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={favorites.includes(item.id) ? "#7a4f9e" : "#aaa"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.plusIcon}
        onPress={() => navigation.navigate("PaginaCarrinho", { produto: item })}
      >
        <FontAwesome5 name="plus" size={14} color="#fff" />
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <Text style={styles.productType}>{item.type}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </View>
  );

  // Botão de admin
  const renderAdminButton = () => {
    if (user?.email === "admin@admin.com") {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: "#7a4f9e",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginHorizontal: 15,
            marginBottom: 10,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("CadastroProdutos")}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Adicionar Produtos
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>Luz e Ouro</Text>
          </View>
          <Text style={styles.subtitle}>Joias e Acessórios</Text>
        </View>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#7a4f9e" />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Coleção Premium</Text>
          <Text style={styles.bannerSubtitle}>Joias exclusivas em ouro e prata.</Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => navigation.navigate("Catalogo")} // <--- Página específica
          >
            <Text style={styles.bannerButtonText}>Ver catálogo</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
        />

        {/* Featured Products */}
        <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
        <FlatList
          data={featuredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          horizontal={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        {/* Launches */}
        <Text style={styles.sectionTitle}>
          Lançamentos <Text style={{ fontWeight: "700", color: "#7a4f9e" }}>NOVO</Text>
        </Text>
        <FlatList
          data={launches}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        />

        {/* Botão admin */}
        {renderAdminButton()}

        {/* Oferta especial */}
        <View style={styles.offerBox}>
          <Text style={styles.offerTitle}>Oferta Especial</Text>
          <Text style={styles.offerDescription}>
            10% de desconto em toda a coleção de prata
          </Text>
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() => navigation.navigate("Catalogo")} // <--- Página específica
          >
            <Text style={styles.offerButtonText}>Ver Catálogo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Estilos (mantidos iguais ao seu original) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { height: 60, paddingHorizontal: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoContainer: { flexDirection: "column" },
  logoBox: { backgroundColor: "#7a4f9e", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 2 },
  logoText: { fontWeight: "600", fontSize: 16, color: "#fff" },
  subtitle: { fontSize: 12, color: "#333" },
  banner: { backgroundColor: "#b59dc4", marginHorizontal: 10, marginVertical: 15, borderRadius: 10, padding: 20, alignItems: "center" },
  bannerTitle: { fontWeight: "700", fontSize: 20, color: "#fff", marginBottom: 5 },
  bannerSubtitle: { fontSize: 14, color: "#eee", marginBottom: 15 },
  bannerButton: { backgroundColor: "#7a4f9e", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  bannerButtonText: { color: "#fff", fontWeight: "600" },
  sectionTitle: { fontWeight: "700", fontSize: 18, marginLeft: 15, marginTop: 5 },
  categoryBtn: { backgroundColor: "#f0f0f0", width: 90, height: 90, marginRight: 12, borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 5 },
  categoryText: { marginTop: 6, fontWeight: "600", color: "#7a4f9e" },
  productCard: { flex: 1, backgroundColor: "#f9f8fb", margin: 8, borderRadius: 12, overflow: "hidden", position: "relative" },
  productImage: { width: "100%", height: 160, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  favoriteIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#fff", borderRadius: 15, padding: 5 },
  plusIcon: { position: "absolute", bottom: 10, right: 10, backgroundColor: "#7a4f9e", borderRadius: 12, padding: 6 },
  productInfo: { padding: 12 },
  productType: { color: "#7a4f9e", fontWeight: "600", marginBottom: 3 },
  productName: { fontWeight: "700", marginBottom: 4 },
  productPrice: { color: "#4a4a4a", fontWeight: "700", fontSize: 16 },
  offerBox: { backgroundColor: "#b59dc4", borderRadius: 10, margin: 15, padding: 20, alignItems: "center" },
  offerTitle: { fontWeight: "700", fontSize: 20, marginBottom: 10, color: "#fff" },
  offerDescription: { fontSize: 14, marginBottom: 15, color: "#eee" },
  offerButton: { backgroundColor: "#7a4f9e", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 6 },
  offerButtonText: { color: "#fff", fontWeight: "600" },
  bottomNav: { height: 60, borderTopWidth: 1, borderTopColor: "#ddd", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 5 },
  navItem: { flex: 1, alignItems: "center" },
});