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

  // ---- CATEGORIAS (AJUSTADO) ----
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate(item.screen)}
    >
      <MaterialCommunityIcons name={item.icon} size={36} color="#7a4f9e" />
      <Text style={styles.categoryLabel}>{item.name}</Text>
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
          style={styles.adminButton}
          onPress={() => navigation.navigate("CadastroProdutos")}
        >
          <Text style={styles.adminButtonText}>Adicionar Produtos</Text>
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
          <Image
            source={{ uri: 'https://via.placeholder.com/30/8a2be2/ffffff?text=L' }}
            style={styles.logoImage}
          />
          <View>
            <Text style={styles.logoText}>Luz e Ouro</Text>
            <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Carrossel de Imagens */}
        <FlatList
          data={[
            { id: "1", image: "https://cdn.sistemawbuy.com.br/arquivos/625ef789af258e29105f73822b9ad450/produtos/6661f0d01975a/mix-de-colares-trio-reluzente-6661f0d11ecec.jpg" },
            { id: "2", image: "https://maisejoias.bwimg.com.br/maisejoias/produtos/brinco-quatro-fios-em-prata-925-1733788515.5791.jpg" },
            { id: "3", image: "https://cdn.iset.io/assets/40180/produtos/3624/anel-balaozinho-prata-cravejado-aparador-em-prata-925-an153-1-2.jpg" },
          ]}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image source={{ uri: item.image }} style={styles.carouselImage} />
            </View>
          )}
          style={styles.carouselContainer}
        />

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        {/* Produtos em destaque */}
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

        {/* Lançamentos */}
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

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 45,
    backgroundColor: '#fff',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 35, height: 35, borderRadius: 5, marginRight: 10, backgroundColor: '#7a4f9e' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logoSubtitle: { fontSize: 12, color: '#666', marginTop: -3 },

  // Carrossel
  carouselContainer: {
    height: 200,
    marginVertical: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  carouselItem: {
    width: 360,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
    backgroundColor: "#f2f2f2",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  sectionTitle: { fontWeight: "700", fontSize: 18, marginLeft: 15, marginTop: 5 },

  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  categoryLabel: {
    color: "#7a4f9e",
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
  },

  productCard: { flex: 1, backgroundColor: "#f9f8fb", margin: 8, borderRadius: 12, overflow: "hidden", position: "relative" },
  productImage: { width: "100%", height: 160, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  favoriteIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#fff", borderRadius: 15, padding: 5 },
  plusIcon: { position: "absolute", bottom: 10, right: 10, backgroundColor: "#7a4f9e", borderRadius: 12, padding: 6 },
  productInfo: { padding: 12 },
  productType: { color: "#7a4f9e", fontWeight: "600", marginBottom: 3 },
  productName: { fontWeight: "700", marginBottom: 4 },
  productPrice: { color: "#4a4a4a", fontWeight: "700", fontSize: 16 },

  adminButton: {
    backgroundColor: "#7a4f9e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  adminButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  bottomNav: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 5,
  },
  navItem: { flex: 1, alignItems: "center" },
});
