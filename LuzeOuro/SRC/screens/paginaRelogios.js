import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';

const screenWidth = Dimensions.get('window').width;

// Dados dos Produtos - Mock
const productsPage1 = [
  { id: 1, type: 'Ouro', title: 'Conjunto Relogio Ouro', price: '999,90', image: 'https://lojalorella.com.br/cdn/shop/files/relogio-feminino-de-luxo-brinde-exclusivo-relogio-feminino-de-luxo-importe-go-ouro-pulseira-de-cristal-646943_640x.jpg?v=1710435914' },
  { id: 2, type: 'Ouro e Prata', title: 'Conjunto Misto', price: '320,90', image: 'https://seculus.vtexassets.com/arquivos/ids/239044-800-auto?v=638319562471670000&width=800&height=auto&aspect=true' },
];

const productsPage2 = [
  { id: 3, type: 'Prata', title: 'Conjunto Prata', price: '540,90', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxI5fBWItXjBrpP5LLN4gDE5U61ab_Yohz6A&s' },
  { id: 4, type: 'Prata', title: 'Relogio Cravejado', price: '1.090,90', image: 'https://uzistore.com.br/cdn/shop/products/Relogio-Ice-Luxury-Cravejado-Prata-Estilo-Patek-2_644x.jpg?v=1725534178' },
];

const productsPage3 = [
  { id: 5, type: 'Ouro', title: 'Conjunto Relogio Ouro', price: '999,90', image: 'https://lojalorella.com.br/cdn/shop/files/relogio-feminino-de-luxo-brinde-exclusivo-relogio-feminino-de-luxo-importe-go-ouro-pulseira-de-cristal-646943_640x.jpg?v=1710435914' },
  { id: 6, type: 'Ouro e Prata', title: 'Conjunto Misto', price: '320,90', image: 'https://seculus.vtexassets.com/arquivos/ids/239044-800-auto?v=638319562471670000&width=800&height=auto&aspect=true' },
  { id: 7, type: 'Ouro', title: 'Relogio', price: '540,90', image: 'https://d1o6h00a1h5k7q.cloudfront.net/imagens/img_m/35033/17043060.jpg' },
  { id: 8, type: 'Ouro', title: 'Relogio com pedras', price: '800,90', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiqRvgMl4ZfMRGbOsXg0hT4V2vT8rKN1jOkw&s' },
];

// Componente de Item do Produto (Card)
const ProductCard = ({ product, user, navigation }) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: product.image }} style={styles.productImage} />

      {/* Ícone de Favorito (igual à Página Inicial) */}
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => navigation.navigate("PaginaFavoritos", { produto: product })}
      >
        <Ionicons name="heart-outline" size={20} color="#aaa" />
      </TouchableOpacity>

      {/* Ícone de + (igual à Página Inicial) */}
      <TouchableOpacity
        style={styles.plusIcon}
        onPress={() => navigation.navigate("PaginaCarrinho", { produto: product })}
      >
        <FontAwesome5 name="plus" size={14} color="#fff" />
      </TouchableOpacity>
    </View>


    <View style={styles.cardDetails}>
      <Text style={styles.productType}>{product.type}</Text>
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productPrice}>R$ {product.price}</Text>
    </View>
  </View>
);

// Componente Principal
export default function PaginaRelogios({ navigation }) {
  const [user, setUser] = useState(null);

  // Pega usuário logado do Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
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
      </View>


      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Relogios Destaque</Text>
        <View style={styles.productsGrid}>
          {productsPage1.map(product => (
            <ProductCard key={product.id} product={product} user={user} navigation={navigation} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Relogios de Prata</Text>
        <View style={styles.productsGrid}>
          {productsPage2.map(product => (
            <ProductCard key={product.id} product={product} user={user} navigation={navigation} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Relogio de Ouro</Text>
        <View style={styles.productsGrid}>
          {productsPage3.map(product => (
            <ProductCard key={product.id} product={product} user={user} navigation={navigation} />
          ))}
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

  logoBox: { backgroundColor: "#7a4f9e", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 2 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 15 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: -5 },
  cardContainer: { width: screenWidth / 2 - 20, marginBottom: 15, marginHorizontal: 5, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
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
  bottomNav: { height: 60, borderTopWidth: 1, borderTopColor: "#ddd", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 5 },
  navItem: { flex: 1, alignItems: "center" },
});