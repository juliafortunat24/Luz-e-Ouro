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
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';
import { Modal } from "react-native";

import { useTheme } from "./ThemeContext";

const screenWidth = Dimensions.get('window').width;

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

  // 🔥 Verifica se o produto já está favoritado
  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("favoritos")
        .select("*")
        .eq("id_usuario", user.id)
        .eq("id_produto", product.id)
        .maybeSingle();

      if (data) setIsFavorite(true);
    };

    checkFavorite();
  }, []);

  // 🔥 Função de favoritar / desfavoritar
  const toggleFavorito = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para favoritar um item.");
      return;
    }

    // remover dos favoritos
    if (isFavorite) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("id_usuario", user.id)
        .eq("id_produto", product.id);

      setIsFavorite(false);
      return;
    }

    // adicionar aos favoritos
    const { error } = await supabase
      .from("favoritos")
      .insert({
        id_usuario: user.id,
        id_produto: product.id,
      });

    if (!error) {
      setIsFavorite(true);
      navigation.navigate("PaginaFavoritos");  // 👉 envia para favoritos!
    }

  };

  const adicionarAoCarrinho = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para adicionar ao carrinho.");
      return;
    }

    const { data: existente } = await supabase
      .from("carrinho")
      .select("*")
      .eq("user_id", user.id)
      .eq("produto_id", product.id)
      .maybeSingle();

    if (existente) {
      await supabase
        .from("carrinho")
        .update({ quantidade: existente.quantidade + 1 })
        .eq("id", existente.id);
    } else {
      const { error } = await supabase
        .from("carrinho")
        .insert({
          user_id: user.id,
          produto_id: product.id,
          quantidade: 1
        });

      if (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível adicionar ao carrinho.");
        return;
      }
    }

    navigation.navigate("PaginaCarrinho");
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      <View style={[styles.imageWrapper, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Image
            source={{ uri: formattedProduct.image }}
            style={styles.productImage}
          />
        </TouchableOpacity>

        {/* ❤️ ÍCONE DE FAVORITAR COMPLETO */}
        <TouchableOpacity
          style={[styles.favoriteIcon, { backgroundColor: colors.card }]}
          onPress={toggleFavorito}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? colors.primary : "#aaa"}   // 💜 roxo quando favoritado
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

        {/* MODAL */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.overlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.card }]}>

              <Image
                source={{ uri: formattedProduct.image }}
                style={styles.modalImage}
              />

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
                onPress={async () => {
                  await adicionarAoCarrinho();
                  setShowModal(false);
                }}
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
      </View>
    </View>
  );
};

export default function PaginaAneis({ navigation }) {
  const { colors } = useTheme();
  const [aneis, setAneis] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAneis = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('produtos')
      .select("id, nome, preco, material, tipo, foto_url")
      .ilike("tipo", "%Ané%");

    if (!error) setAneis(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAneis();
  }, []);

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>

      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.logoContainer}>
          <View>
            <Text style={[styles.logoText, { color: colors.text }]}>Luz e Ouro</Text>
            <Text style={[styles.logoSubtitle, { color: colors.text }]}>
              Joias e Acessórios
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.categoryNav, { backgroundColor: colors.card, borderBottomColor: colors.text }]}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaBrincos")}>
          <Text style={[styles.categoryButton, { color: colors.text }]}>Brincos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaColares")}>
          <Text style={[styles.categoryButton, { color: colors.text }]}>Colares</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaAneis")}>
          <Text style={[styles.categoryButton, styles.categoryActive, { color: colors.primary }]}>Anéis</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaRelogios")}>
          <Text style={[styles.categoryButton, { color: colors.text }]}>Relógios</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Anéis</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : aneis.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 60, color: colors.text }}>
            Nenhum anel encontrado.
          </Text>
        ) : (
          <View style={styles.productsGrid}>
            {aneis.map(prod => (
              <ProductCard key={prod.id} product={prod} navigation={navigation} />
            ))}
          </View>
        )}
      </ScrollView>

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

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  scrollViewContent: { paddingHorizontal: 15, paddingBottom: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 10,
  },

  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoText: { fontSize: 18, fontWeight: "bold" },
  logoSubtitle: { fontSize: 12, marginTop: -3 },

  categoryNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  categoryButton: {
    fontSize: 15,
    fontWeight: "500",
  },

  categoryActive: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardContainer: {
    width: screenWidth / 2 - 20,
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
  },

  imageWrapper: { width: "100%", height: 150 },
  productImage: { width: "100%", height: "100%" },

  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 20,
  },

  cardDetails: { padding: 10 },
  productType: { fontSize: 14 },
  productTitle: { fontSize: 15, fontWeight: "600", marginVertical: 3 },
  productPrice: { fontSize: 16, fontWeight: "bold" },

  priceCartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  bottomNav: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
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
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },

  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 15,
  },

  modalName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
  },

  modalType: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },

  modalPrice: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 5,
  },

  modalButton: {
    backgroundColor: "#7a4f9e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  closeButton: {
    marginTop: 15,
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
