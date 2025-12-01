import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';

// IMPORTANTE — ATIVAR O TEMA GLOBAL
import { useTheme } from "./ThemeContext";

const categories = [
  { id: "1", name: "Anéis", icon: "diamond", screen: "PaginaAneis" },
  { id: "2", name: "Colares", icon: "star", screen: "PaginaColares" },
  { id: "3", name: "Relógios", icon: "clock", screen: "PaginaRelogios" },
  { id: "4", name: "Brincos", icon: "crown", screen: "PaginaBrincos" },
];

export default function App({ navigation }) {

  // ⬇⬇⬇ PEGANDO O TEMA GLOBAL
  const { colors } = useTheme();

  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('produtos')
      .select('id, nome, preco, material, tipo, foto_url')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      setLoading(false);
      return;
    }

    if (data) {
      const formattedProducts = data.map(item => ({
        id: item.id,
        type: item.material,
        name: item.nome,
        price: `R$ ${parseFloat(item.preco).toFixed(2).replace('.', ',')}`,
        image: item.foto_url || "https://placehold.co/200x200?text=Sem+Imagem",
      }));

      setProducts(formattedProducts);
    }

    setLoading(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      await fetchProducts();
    };
    initializeData();
  }, []);

  const featuredProducts = products;
  const launches = products.filter((_, index) => index < 2);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles(colors).categoryItem}
      onPress={() => navigation.navigate(item.screen)}
    >
      <MaterialCommunityIcons name={item.icon} size={36} color="#7a4f9e" />
      <Text style={styles(colors).categoryLabel}>{item.name}</Text>
    </TouchableOpacity>
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (produto) => {
    navigation.navigate("PaginaCarrinho", { produto: produto });
  };

  const renderProductItem = ({ item }) => (
    <View style={styles(colors).productCard}>
      <Image
        source={{ uri: item.image }}
        style={styles(colors).productImage}
        resizeMode="cover"
      />

      <TouchableOpacity
        style={styles(colors).favoriteIcon}
        onPress={() => {
          toggleFavorite(item.id);
          navigation.navigate("PaginaFavoritos", { produto: item });
        }}
      >
        <Ionicons
          name={favorites.includes(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={favorites.includes(item.id) ? "#7a4f9e" : colors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ position: "absolute", bottom: 10, right: 10 }}
        onPress={() => addToCart(item)}
      >
        <Ionicons name="cart-outline" size={24} color="#7a4f9e" />
      </TouchableOpacity>

      <View style={styles(colors).productInfo}>
        <Text style={styles(colors).productType}>{item.type}</Text>
        <Text style={styles(colors).productName}>{item.name}</Text>
        <Text style={styles(colors).productPrice}>{item.price}</Text>
      </View>
    </View>
  );

  const renderAdminButton = () => {
    if (user?.email === "admin@admin.com") {
      return (
        <TouchableOpacity
          style={styles(colors).adminButton}
          onPress={() => navigation.navigate("CadastroProdutos")}
        >
          <Text style={styles(colors).adminButtonText}>Adicionar Produtos</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <View style={styles(colors).logoContainer}>
          <View>
            <Text style={styles(colors).logoText}>Luz e Ouro</Text>
            <Text style={styles(colors).logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* CARROSSEL */}
        <FlatList
          data={[
            { id: "1", image: require('../../assets/banner1.jpeg') },
            { id: "2", image: require('../../assets/banner2.jpeg') },
            { id: "3", image: require('../../assets/banner3.jpeg') },
          ]}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles(colors).carouselItem}>
              <Image source={item.image} style={styles(colors).carouselImage} />
            </View>
          )}
          style={styles(colors).carouselContainer}
        />

        <Text style={styles(colors).sectionTitle}>Categorias</Text>

        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#7a4f9e" style={{ marginTop: 50 }} />
        ) : (
          <>
            <Text style={styles(colors).sectionTitle}>Produtos em Destaque</Text>

            <FlatList
              data={featuredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            <Text style={styles(colors).sectionTitle}>
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
          </>
        )}

        {renderAdminButton()}
      </ScrollView>

      {/* MENU INFERIOR */}
      <View style={styles(colors).bottomNav}>
        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    header: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      paddingTop: 45,
      backgroundColor: colors.background,
    },

    logoContainer: { flexDirection: "row", alignItems: "center" },
    logoText: { fontSize: 18, fontWeight: "bold", color: colors.text },
    logoSubtitle: { fontSize: 12, color: colors.text },

    carouselContainer: { height: 200, marginVertical: 15 },
    carouselItem: {
      width: 360,
      height: 200,
      borderRadius: 10,
      overflow: "hidden",
      marginHorizontal: 10,
      backgroundColor: colors.card,
    },
    carouselImage: { width: "100%", height: "100%" },

    sectionTitle: {
      fontWeight: "700",
      fontSize: 18,
      marginLeft: 15,
      marginTop: 5,
      color: colors.text,
    },

    categoryItem: { alignItems: "center", justifyContent: "center", marginHorizontal: 20 },
    categoryLabel: { color: "#7a4f9e", marginTop: 8, fontWeight: "600" },

    productCard: {
      flex: 1,
      backgroundColor: colors.card,
      margin: 8,
      borderRadius: 12,
      overflow: "hidden",
      position: "relative",
    },

    productImage: { width: "100%", height: 160 },
    favoriteIcon: { position: "absolute", top: 10, right: 10, backgroundColor: colors.background, borderRadius: 15, padding: 5 },

    productInfo: { padding: 12 },
    productType: { color: "#7a4f9e", fontWeight: "600" },
    productName: { fontWeight: "700", color: colors.text },
    productPrice: { color: colors.text, fontWeight: "700", fontSize: 16 },

    adminButton: {
      backgroundColor: "#7a4f9e",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginHorizontal: 15,
      marginBottom: 10,
      alignItems: "center",
    },
    adminButtonText: { color: "#fff", fontWeight: "700" },

    bottomNav: {
      height: 60,
      borderTopWidth: 1,
      borderTopColor: colors.card,
      backgroundColor: colors.background,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingBottom: 5,
    },
    navItem: { flex: 1, alignItems: "center" },
  });
