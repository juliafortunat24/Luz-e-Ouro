import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';

const screenWidth = Dimensions.get('window').width;

// Componente de Item do Produto (Card)
const ProductCard = ({ product, user, navigation }) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: product.foto_url || 'https://placehold.co/200x200?text=Sem+Imagem' }}
        style={styles.productImage}
      />

      {/* Ícone de Favorito */}
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => navigation.navigate("PaginaFavoritos", { produto: product })}
      >
        <Ionicons name="heart-outline" size={20} color="#aaa" />
      </TouchableOpacity>

      {/* Ícone de Carrinho */}
      <TouchableOpacity
        style={styles.plusIcon}
        onPress={() => navigation.navigate("PaginaCarrinho", { produto: product })}
      >
        <FontAwesome5 name="plus" size={14} color="#fff" />
      </TouchableOpacity>
    </View>

    <View style={styles.cardDetails}>
      <Text style={styles.productType}>{product.material}</Text>
      <Text style={styles.productTitle}>{product.nome}</Text>
      <Text style={styles.productPrice}>R$ {parseFloat(product.preco).toFixed(2).replace('.', ',')}</Text>
    </View>
  </View>
);

// Componente Principal
export default function PaginaBrincos({ navigation }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pega usuário logado e busca produtos do tipo "Brinco"
  useEffect(() => {
    const getUserAndProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Busca todos os produtos com tipo "Brinco"
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome, preco, material, tipo, foto_url')
        .ilike('tipo', '%Brinco%'); // <-- Filtra todos que tenham "Brinco" no tipo

      if (error) {
        console.error('Erro ao buscar brincos:', error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    getUserAndProducts();
  }, []);

  return (
    <View style={styles.screenContainer}>
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

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Brincos</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#7a4f9e" style={{ marginTop: 50 }} />
        ) : products.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#777' }}>
            Nenhum brinco encontrado.
          </Text>
        ) : (
          <View style={styles.productsGrid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} user={user} navigation={navigation} />
            ))}
          </View>
        )}
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
  screenContainer: { flex: 1, backgroundColor: '#fff' },
  scrollViewContent: { paddingHorizontal: 15, paddingBottom: 20 },
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
  logoImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#7a4f9e',
  },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logoSubtitle: { fontSize: 12, color: '#666', marginTop: -3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 15 },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5,
  },
  cardContainer: {
    width: screenWidth / 2 - 20,
    marginBottom: 15,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageWrapper: { position: 'relative', width: '100%', height: 150 },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
  },
  plusIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#7a4f9e",
    borderRadius: 12,
    padding: 6,
  },
  cardDetails: { padding: 10 },
  productType: { fontSize: 14, color: '#555', marginBottom: 2 },
  productTitle: { fontSize: 15, fontWeight: '600', marginBottom: 5, color: '#333' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#8a2be2' },
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
