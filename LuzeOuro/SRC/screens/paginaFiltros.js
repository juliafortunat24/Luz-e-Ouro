import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// --- DADOS MOCKADOS PARA PRODUTOS ---
const products = [
  { id: 1, type: 'Colar', material: 'Ouro', title: 'Colar de Ouro Elegante', price: 309.9, image: 'https://cdn.awsli.com.br/600x450/940/940346/produto/198470554/colar-choker-fita-slim-8d612c0eb6.jpg' },
  { id: 2, type: 'Colar', material: 'Ouro', title: 'Colar com Pingente', price: 820.9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7b8qO9G1H8P9jgseoeCSRLfRj796LEFzSgg&s' },
  { id: 3, type: 'Anel', material: 'Prata', title: 'Anel Cravejado', price: 540.9, image: 'https://cdn.iset.io/assets/40180/produtos/3624/anel-balaozinho-prata-cravejado-aparador-em-prata-925-an153-1-2.jpg' },
  { id: 4, type: 'Anel', material: 'Ouro Branco', title: 'Anel com Turmalina', price: 1090.9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHcZlJUe0vFNCs3NM_rg1Iu2Ka7SoTgAUbfQ&s' },
  { id: 5, type: 'Brinco', material: 'Prata', title: 'Brinco Brilhante', price: 250.9, image: 'https://mirianteofilojoias.com.br/wp-content/uploads/2024/07/brinco-de-prata-base-dupla-cravejada-com-perola-pendurada-2.jpg' },
  { id: 6, type: 'Brinco', material: 'Ouro', title: 'Brinco de rosas', price: 470.9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrMGLOhAne0y5RMCQiMfjujTlodUr3F9Xpbw&s' },
];

// --- OPÇÕES DE FILTRO ---
const filterOptions = {
  tipos: ['Todos os tipos', 'Colar', 'Relogio', 'Anel', 'Brinco'],
  materiais: ['Todos os materiais', 'Ouro', 'Prata', 'Ouro Branco'],
  precos: ['Todos os preços', 'Até R$500', 'R$500 a R$1.000', 'R$1.000 a R$1.500', 'Acima de R$1.500'],
};

// --- COMPONENTES ---
const ProductCard = ({ product, navigation }) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => navigation.navigate("PaginaFavoritos", { produto: product })}
      >
        <Ionicons name="heart-outline" size={20} color="#aaa" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.plusIcon}
        onPress={() => navigation.navigate("PaginaCarrinho", { produto: product })}
      >
        <FontAwesome5 name="plus" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
    <View style={styles.cardDetails}>
      <Text style={styles.productType}>{product.type} - {product.material}</Text>
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
    </View>
  </View>
);

const Header = () => (
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

);

// --- Bottom Navigation ---
const BottomNav = ({ navigation }) => {
  const route = useRoute();
  const currentScreen = route.name;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaInicial")}>
        <MaterialCommunityIcons
          name={currentScreen === "PaginaInicial" ? "home" : "home-outline"}
          size={28}
          color={currentScreen === "PaginaInicial" ? "#7a4f9e" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
        <Ionicons
          name={currentScreen === "PaginaFiltros" ? "search" : "search-outline"}
          size={28}
          color={currentScreen === "PaginaFiltros" ? "#7a4f9e" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
        <Ionicons
          name={currentScreen === "PaginaFavoritos" ? "heart" : "heart-outline"}
          size={28}
          color={currentScreen === "PaginaFavoritos" ? "#7a4f9e" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaCarrinho")}>
        <Ionicons
          name={currentScreen === "PaginaCarrinho" ? "cart" : "cart-outline"}
          size={28}
          color={currentScreen === "PaginaCarrinho" ? "#7a4f9e" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
        <Ionicons
          name={currentScreen === "PaginaPerfil" ? "person" : "person-outline"}
          size={28}
          color={currentScreen === "PaginaPerfil" ? "#7a4f9e" : "#aaa"}
        />
      </TouchableOpacity>
    </View>
  );
};

// --- TELA PRINCIPAL ---
export default function CatalogScreen({ navigation }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    tipos: 'Todos os tipos',
    materiais: 'Todos os materiais',
    precos: 'Todos os preços',
  });

  const filteredProducts = products.filter(p => {
    const matchTipo = selectedFilters.tipos === 'Todos os tipos' || p.type === selectedFilters.tipos;
    const matchMaterial = selectedFilters.materiais === 'Todos os materiais' || p.material === selectedFilters.materiais;
    const price = p.price;
    let matchPreco = true;

    switch (selectedFilters.precos) {
      case 'Até R$500':
        matchPreco = price <= 500;
        break;
      case 'R$500 a R$1.000':
        matchPreco = price > 500 && price <= 1000;
        break;
      case 'R$1.000 a R$1.500':
        matchPreco = price > 1000 && price <= 1500;
        break;
      case 'Acima de R$1.500':
        matchPreco = price > 1500;
        break;
    }

    return matchTipo && matchMaterial && matchPreco;
  });

  const renderDropdown = (key) => (
    <View style={styles.dropdownMenu}>
      {filterOptions[key].map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.dropdownItem}
          onPress={() => {
            setSelectedFilters(prev => ({ ...prev, [key]: option }));
            setOpenDropdown(null);
          }}
        >
          <Text style={styles.dropdownItemText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFilterItem = (key, placeholder) => (
    <View style={[styles.filterItemWrapper, { zIndex: key === 'tipos' ? 30 : key === 'materiais' ? 20 : 10 }]}>
      <TouchableOpacity
        style={[styles.filterDropdownButton, openDropdown === key && styles.filterDropdownButtonActive]}
        onPress={() => setOpenDropdown(openDropdown === key ? null : key)}
      >
        <Text style={styles.filterButtonText}> {selectedFilters[key] || placeholder} </Text>
        <Ionicons name={openDropdown === key ? "chevron-up" : "chevron-down"} size={20} color="#666" />
      </TouchableOpacity>
      {openDropdown === key && renderDropdown(key)}
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Header />
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Buscar" placeholderTextColor="#999" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.filtersBox}>
          <View style={styles.filtersHeader}>
            <Feather name="filter" size={18} color="#333" />
            <Text style={styles.filtersTitle}>Filtros</Text>
          </View>
          {renderFilterItem('tipos', 'Todos os tipos')}
          {renderFilterItem('materiais', 'Todos os materiais')}
          {renderFilterItem('precos', 'Todos os preços')}
        </View>
        <View style={styles.productsGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => <ProductCard key={p.id} product={p} navigation={navigation} />)
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum produto encontrado.</Text>
          )}
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
      {/* 👇 Navbar atualizada */}
      <BottomNav navigation={navigation} />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#fff', overflow: 'visible' },
  scrollViewContent: { paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, paddingTop: 45, backgroundColor: '#fff' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 35, height: 35, borderRadius: 5, marginRight: 10, backgroundColor: '#7a4f9e' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logoSubtitle: { fontSize: 12, color: '#666', marginTop: -3 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, marginHorizontal: 15, marginVertical: 15, height: 45 },
  searchIcon: { marginLeft: 10 },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: '#333' },
  filtersBox: { backgroundColor: '#f5f5f5', marginHorizontal: 15, borderRadius: 10, padding: 15, zIndex: 10, overflow: 'visible' },
  filtersHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  filtersTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8, color: '#333' },
  filterItemWrapper: { position: 'relative', marginBottom: 10 },
  filterDropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  filterDropdownButtonActive: { borderColor: '#9370DB', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  filterButtonText: { fontSize: 15, color: '#333' },
  dropdownMenu: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', borderRadius: 8, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderWidth: 1, borderColor: '#9370DB', borderTopWidth: 0, zIndex: 9999, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84 },
  dropdownItem: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 15, color: '#333' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 20 },
  cardContainer: { width: screenWidth / 2 - 22, marginBottom: 15, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  imageWrapper: { position: 'relative', width: '100%', height: screenWidth / 2 - 22 },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  favoriteIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#fff", borderRadius: 15, padding: 5 },
  plusIcon: { position: "absolute", bottom: 10, right: 10, backgroundColor: "#7a4f9e", borderRadius: 12, padding: 6 },
  cardDetails: { padding: 10, minHeight: 80 },
  productType: { fontSize: 13, color: '#666', marginBottom: 2 },
  productTitle: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#8a2be2' },
  bottomNav: { height: 60, borderTopWidth: 1, borderTopColor: "#ddd", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 5, position: "absolute", bottom: 0, width: "100%" },
  navItem: { flex: 1, alignItems: "center" },
});