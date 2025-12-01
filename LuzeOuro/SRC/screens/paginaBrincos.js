import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';
import { useTheme } from "./ThemeContext";  // ✔ CAMINHO CORRETO

const screenWidth = Dimensions.get('window').width;

const ProductCard = ({ product, navigation }) => {
  const { colors } = useTheme(); // ✔ TEMA GLOBAL

  const formattedProduct = {
    id: product.id,
    type: product.material,
    name: product.nome,
    price: `R$ ${Number(product.preco).toFixed(2).replace('.', ',')}`,
    image: product.foto_url || "https://placehold.co/200x200?text=Sem+Imagem",
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: formattedProduct.image }} style={styles.productImage} />

        <TouchableOpacity
          style={[styles.favoriteIcon, { backgroundColor: colors.card }]}
          onPress={() =>
            navigation.navigate("PaginaFavoritos", { produto: formattedProduct })
          }
        >
          <Ionicons name="heart-outline" size={20} color={colors.textSecundario} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardDetails}>
        <Text style={[styles.productType, { color: "#7a4f9e" }]}>
          {formattedProduct.type}
        </Text>

        <Text style={[styles.productTitle, { color: colors.text }]}>
          {formattedProduct.name}
        </Text>

        <View style={styles.priceCartRow}>
          <Text style={[styles.productPrice, { color: "#7a4f9e" }]}>
            {formattedProduct.price}
          </Text>

          <TouchableOpacity>
            <Ionicons name="cart-outline" size={20} color="#7a4f9e" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function PaginaBrincos({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { colors } = useTheme(); // ✔ TEMA GLOBAL

  useEffect(() => {
    const loadProducts = async () => {
      const { data } = await supabase
        .from('produtos')
        .select("id, nome, preco, material, tipo, foto_url")
        .ilike("tipo", "%Brinco%");
      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/30/8a2be2/ffffff?text=L" }}
            style={styles.logoImage}
          />
          <View>
            <Text style={[styles.logoText, { color: colors.text }]}>Luz e Ouro</Text>
            <Text style={[styles.logoSubtitle, { color: colors.textSecundario }]}>
              Joias e Acessórios
            </Text>
          </View>
        </View>
      </View>

      {/* NAVEGAÇÃO */}
      <View style={[styles.categoryNav, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.categoryButton, styles.categoryActive]}>Brincos</Text>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaColares")}>
          <Text style={[styles.categoryButton, { color: colors.textSecundario }]}>Colares</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaAneis")}>
          <Text style={[styles.categoryButton, { color: colors.textSecundario }]}>Anéis</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaRelogios")}>
          <Text style={[styles.categoryButton, { color: colors.textSecundario }]}>Relógios</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Brincos</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#7a4f9e" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.productsGrid}>
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} navigation={navigation} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <MaterialCommunityIcons name="home" size={28} color="#7a4f9e" />
        <Ionicons name="search-outline" size={28} color="#7a4f9e" />
        <Ionicons name="heart-outline" size={28} color="#7a4f9e" />
        <Ionicons name="cart-outline" size={28} color="#7a4f9e" />
        <Ionicons name="person-outline" size={28} color="#7a4f9e" />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  scrollViewContent: { paddingHorizontal: 15, paddingBottom: 20 },
  header: { flexDirection: "row", paddingHorizontal: 15, paddingTop: 45, paddingBottom: 10 },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: { width: 35, height: 35, marginRight: 10, borderRadius: 6 },
  logoText: { fontSize: 18, fontWeight: "bold" },
  logoSubtitle: { fontSize: 12 },
  categoryNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderBottomWidth: 1 },
  categoryButton: { fontSize: 15, fontWeight: "500" },
  categoryActive: { color: "#7a4f9e", textDecorationLine: "underline" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cardContainer: { width: screenWidth / 2 - 20, marginBottom: 15, borderRadius: 8 },
  imageWrapper: { width: "100%", height: 150, backgroundColor: "#eee" },
  productImage: { width: "100%", height: "100%" },
  favoriteIcon: { position: "absolute", top: 10, right: 10, padding: 5, borderRadius: 20 },
  cardDetails: { padding: 10 },
  productType: { fontSize: 14 },
  productTitle: { fontSize: 15, fontWeight: "600" },
  productPrice: { fontSize: 16, fontWeight: "bold" },
  priceCartRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  bottomNav: { height: 60, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1 }
});
