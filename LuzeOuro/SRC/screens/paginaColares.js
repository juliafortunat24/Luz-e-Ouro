import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { supabase } from '../supabaseClient'; 

const screenWidth = Dimensions.get('window').width;

// Dados dos Produtos - Mock
const productsPage1 = [
  { id: 1, type: 'Ouro', title: 'Colar de ouro Elegante', price: 'R$ 309,90', image: 'https://cdn.awsli.com.br/600x450/940/940346/produto/198470554/colar-choker-fita-slim-8d612c0eb6.jpg' },
  { id: 2, type: 'Ouro', title: 'Colar com pingente', price: '320,90', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7b8qO9G1H8P9jgseoeCSRLfRj796LEFzSgg&s' },
];

const productsPage2 = [
  { id: 3, type: 'Prata', title: 'Conjunto Prata', price: '540,90', image: 'https://cdn.sistemawbuy.com.br/arquivos/625ef789af258e29105f73822b9ad450/produtos/6661f0d01975a/mix-de-colares-trio-reluzente-6661f0d11ecec.jpg' },
  { id: 4, type: 'Prata', title: 'Ponto de Luz Prata', price: '800,90', image: 'https://glamourpratas.cdn.magazord.com.br/img/2022/03/produto/316/colar-ponto-de-luz-coracao-prata-925-glamour-pratas.jpeg?ims=700x700' },
];

const productsPage3 = [
  { id: 5, type: 'Ouro', title: 'Corrente Larga', price: '999,90', image: 'https://fluiartejoias.vteximg.com.br/arquivos/ids/180890-550-550/colar-fluiarte-em-ouro-18k-malha-cordao.jpg?v=638792872233700000' },
  { id: 6, type: 'Ouro ', title: 'Duplo Coração', price: '320,90', image: 'https://images.tcdn.com.br/img/img_prod/1094443/colar_duplo_mini_elo_com_pingente_coracao_banhado_a_ouro_12801_1_abb380983a55e344c1c17178bd21ba9f.jpg' },
  { id: 7, type: 'Ouro', title: 'Colar de ouro Elegante', price: '309,90', image: 'https://cdn.awsli.com.br/600x450/940/940346/produto/198470554/colar-choker-fita-slim-8d612c0eb6.jpg' },
  { id: 8, type: 'Ouro', title: 'Colar com pingente', price: '320,90', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7b8qO9G1H8P9jgseoeCSRLfRj796LEFzSgg&s' },
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
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>Luz e Ouro</Text>
          </View>
          <Text style={styles.subtitle}>Joias e Acessórios</Text>
        </View>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#7a4f9e" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Colares Destaque</Text>
        <View style={styles.productsGrid}>
          {productsPage1.map(product => (
            <ProductCard key={product.id} product={product} user={user} navigation={navigation} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Colares de Prata</Text>
        <View style={styles.productsGrid}>
          {productsPage2.map(product => (
            <ProductCard key={product.id} product={product} user={user} navigation={navigation} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Colares de Ouro</Text>
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
  header: { height: 60, paddingHorizontal: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoContainer: { flexDirection: "column" },
  logoBox: { backgroundColor: "#7a4f9e", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 2 },
  logoText: { fontWeight: "600", fontSize: 16, color: "#fff" },
  subtitle: { fontSize: 12, color: "#333" },
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