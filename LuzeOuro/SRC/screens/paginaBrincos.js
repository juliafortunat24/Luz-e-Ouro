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
  Alert,
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';
import { useTheme } from "./ThemeContext";

const screenWidth = Dimensions.get('window').width;

/* ============================
      COMPONENTE PRODUCT CARD
   ============================ */
const ProductCard = ({ product, navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { colors } = useTheme();

  const formattedProduct = {
    id: product.id,
    type: product.material,
    name: product.nome,
    price: `R$ ${Number(product.preco).toFixed(2).replace('.', ',')}`,
    image: product.foto_url || "https://placehold.co/200x200?text=Sem+Imagem",
  };

  /* ============================
       VERIFICA SE É FAVORITO
     ============================ */
  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("favoritos")
      .select("*")
      .eq("id_usuario", user.id)
      .eq("id_produto", product.id);

    setIsFavorite(data && data.length > 0);
  };

  /* ============================
           FAVORITAR ITEM
     ============================ */
  const toggleFavorito = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para favoritar um item.");
      return;
    }

    if (isFavorite) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("id_usuario", user.id)
        .eq("id_produto", product.id);

      setIsFavorite(false);
      return;
    }

    const { error } = await supabase
      .from("favoritos")
      .insert({
        id_usuario: user.id,
        id_produto: product.id,
      });

    if (!error) {
      setIsFavorite(true);
      navigation.navigate("PaginaFavoritos");
    }
  };

  /* ============================
        ADICIONAR AO CARRINHO
     ============================ */
  const adicionarAoCarrinho = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Atenção", "Você precisa estar logado para adicionar ao carrinho.");
        return;
      }

      const { data: existente } = await supabase
        .from("carrinho")
        .select("*")
        .eq("user_id", user.id)
        .eq("produto_id", formattedProduct.id)
        .maybeSingle();

      if (existente) {
        await supabase
          .from("carrinho")
          .update({ quantidade: existente.quantidade + 1 })
          .eq("id", existente.id);
      } else {
        await supabase.from("carrinho").insert({
          user_id: user.id,
          produto_id: formattedProduct.id,
          quantidade: 1,
        });
      }

      navigation.navigate("PaginaCarrinho");
      setShowModal(false);
    } catch (e) {
      console.error("Erro inesperado:", e);
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    }
  };

  return (
    <>
      <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
        <View style={[styles.imageWrapper, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Image source={{ uri: formattedProduct.image }} style={styles.productImage} />
          </TouchableOpacity>

          {/* ÍCONE DO CORAÇÃO */}
          <TouchableOpacity
            style={[styles.favoriteIcon, { backgroundColor: colors.card }]}
            onPress={toggleFavorito}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? colors.primary : colors.textSecundario}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardDetails}>
          <Text style={[styles.productType, { color: colors.primary }]}>
            {formattedProduct.type}
          </Text>

          <Text style={[styles.productTitle, { color: colors.text }]}>
            {formattedProduct.name}
          </Text>

          <View style={styles.priceCartRow}>
            <Text style={[styles.productPrice, { color: colors.primary }]}>
              {formattedProduct.price}
            </Text>

            <TouchableOpacity onPress={adicionarAoCarrinho}>
              <Ionicons name="cart-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MODAL DE DETALHES */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Image source={{ uri: formattedProduct.image }} style={styles.modalImage} />

            <Text style={[styles.modalName, { color: colors.text }]}>
              {formattedProduct.name}
            </Text>
            <Text style={[styles.modalType, { color: colors.primary }]}>
              {formattedProduct.type}
            </Text>
            <Text style={[styles.modalPrice, { color: colors.text }]}>
              {formattedProduct.price}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={adicionarAoCarrinho}
            >
              <Text style={styles.modalButtonText}>Adicionar ao Carrinho</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={[styles.closeButtonText, { color: colors.primary }]}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

/* ============================
        PÁGINA BRINCOS
   ============================ */
export default function PaginaBrincos({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

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

      {/* NAV INFERIOR */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.text }]}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home" size={28} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={28} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ============================
           ESTILOS
   ============================ */
const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  scrollViewContent: { paddingHorizontal: 15, paddingBottom: 20 },

  header: { flexDirection: "row", paddingHorizontal: 15, paddingTop: 45, paddingBottom: 10 },

  logoContainer: { flexDirection: "row", alignItems: "center" },
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

  bottomNav: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },

  modalImage: { width: 300, height: 300, borderRadius: 15 },

  modalName: { fontSize: 22, fontWeight: "700", marginTop: 15 },
  modalType: { fontSize: 16, fontWeight: "600", marginTop: 5 },
  modalPrice: { fontSize: 20, fontWeight: "700", marginTop: 5 },

  modalButton: {
    backgroundColor: "#7a4f9e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },

  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  closeButton: { marginTop: 15 },
  closeButtonText: { fontSize: 16, fontWeight: "700" },
});

