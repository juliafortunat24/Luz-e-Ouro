import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';

const screenWidth = Dimensions.get('window').width;


// ⭐ CARD DO PRODUTO
const ProductCard = ({ product, navigation }) => {

  const formattedProduct = {
    id: product.id,
    type: product.material,
    name: product.nome,
    price: `R$ ${Number(product.preco).toFixed(2).replace('.', ',')}`,
    image: product.foto_url || "https://placehold.co/200x200?text=Sem+Imagem",
  };

  /* ADICIONAR AO CARRINHO + REDIRECIONAR */
  const adicionarAoCarrinho = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para adicionar ao carrinho.");
      return;
    }

    // Verifica se já existe no carrinho
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

    // Redirecionar para o carrinho
    navigation.navigate("PaginaCarrinho");
  };


  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: formattedProduct.image }}
          style={styles.productImage}
        />

        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => navigation.navigate("PaginaFavoritos", { produto: formattedProduct })}
        >
          <Ionicons name="heart-outline" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardDetails}>
        <Text style={[styles.productType, { color: '#7a4f9e' }]}>
          {formattedProduct.type}
        </Text>

        <Text style={styles.productTitle}>{formattedProduct.name}</Text>

        <View style={styles.priceCartRow}>
          <Text style={styles.productPrice}>{formattedProduct.price}</Text>

          {/* ÍCONE DO CARRINHO ATUALIZADO */}
          <TouchableOpacity onPress={adicionarAoCarrinho}>
            <Ionicons name="cart-outline" size={20} color="#7a4f9e" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};



// ⭐ PÁGINA PRINCIPAL
export default function PaginaRelogios({ navigation }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchRelogios = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("produtos")
      .select("id, nome, preco, material, tipo, foto_url")
      .ilike("tipo", "%Rel%");

    if (error) console.error("Erro ao carregar relógios:", error);
    else setProducts(data);

    setLoading(false);
  };


  useEffect(() => {
    fetchRelogios();
  }, []);



  return (
    <View style={styles.screenContainer}>


      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/30/8a2be2/ffffff?text=L" }}
            style={styles.logoImage}
          />

          <View>
            <Text style={styles.logoText}>Luz e Ouro</Text>
            <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>



      {/* ⭐ NAVEGAÇÃO ENTRE CATEGORIAS (IGUAL A PAGINA ANEIS) */}
      <View style={styles.categoryNav}>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaBrincos")}>
          <Text style={styles.categoryButton}>Brincos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaColares")}>
          <Text style={styles.categoryButton}>Colares</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaAneis")}>
          <Text style={styles.categoryButton}>Anéis</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaRelogios")}>
          <Text style={[styles.categoryButton, styles.categoryActive]}>Relógios</Text>
        </TouchableOpacity>

      </View>




      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Relógios</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#7a4f9e" style={{ marginTop: 60 }} />
        ) : products.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 60, color: "#777" }}>
            Nenhum relógio encontrado.
          </Text>
        ) : (
          <View style={styles.productsGrid}>
            {products.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                navigation={navigation}
              />
            ))}
          </View>
        )}
      </ScrollView>




      {/* ⭐ BOTTOM NAV */}
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




// ⭐ ESTILOS — IGUAIS AOS DA PÁGINA DE ANÉIS
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#fff" },
  scrollViewContent: { paddingHorizontal: 15, paddingBottom: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },

  logoContainer: { flexDirection: "row", alignItems: "center" },

  logoImage: {
    width: 35,
    height: 35,
    marginRight: 10,
    borderRadius: 6,
  },

  logoText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  logoSubtitle: { fontSize: 12, color: "#555", marginTop: -3 },

  /* ⭐ MENU DAS CATEGORIAS */
  categoryNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fafafa",
  },

  categoryButton: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },

  categoryActive: {
    color: "#7a4f9e",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginVertical: 15 },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardContainer: {
    width: screenWidth / 2 - 20,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },

  imageWrapper: { width: "100%", height: 150, backgroundColor: "#eee" },
  productImage: { width: "100%", height: "100%" },

  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
  },

  cardDetails: { padding: 10 },
  productType: { fontSize: 14, color: "#7a4f9e" },
  productTitle: { fontSize: 15, fontWeight: "600", marginVertical: 3 },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "#7a4f9e" },

  bottomNav: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
});