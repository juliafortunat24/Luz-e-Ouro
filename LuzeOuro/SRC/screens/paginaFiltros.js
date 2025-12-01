import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../supabaseClient';
import { useTheme } from './ThemeContext';  // ⬅️ AQUI

const screenWidth = Dimensions.get('window').width;

const filterOptions = {
  tipos: ['Todos os tipos', 'Colar', 'Relogios', 'Anéis', 'Brincos'],
  materiais: ['Todos os materiais', 'Ouro', 'Prata', 'Ouro Branco'],
  precos: ['Todos os preços', 'Até R$500', 'R$500 a R$1.000', 'R$1.000 a R$1.500', 'Acima de R$1.500'],
};

const ProductCard = ({ product, navigation }) => {

  const { colors } = useTheme(); // ⬅️ TEMA AQUI

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
        <Image
          source={{ uri: formattedProduct.image }}
          style={styles.productImage}
        />

        <TouchableOpacity
          style={[styles.favoriteIcon, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("PaginaFavoritos", { produto: formattedProduct })}
        >
          <Ionicons name="heart-outline" size={20} color={colors.text} />
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

          <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
            <Ionicons name="cart-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Header = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/30/8a2be2/ffffff?text=L' }}
          style={styles.logoImage}
        />
        <View>
          <Text style={[styles.logoText, { color: colors.text }]}>Luz e Ouro</Text>
          <Text style={[styles.logoSubtitle, { color: colors.text }]}>Joias e Acessórios</Text>
        </View>
      </View>
    </View>
  );
};

const BottomNav = ({ navigation }) => {
  const route = useRoute();
  const currentScreen = route.name;
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: isDark ? "#555" : "#ddd" }]}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaInicial")}>
        <MaterialCommunityIcons
          name={currentScreen === "PaginaInicial" ? "home" : "home-outline"}
          size={28}
          color={currentScreen === "PaginaInicial" ? colors.primary : colors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
        <Ionicons
          name={currentScreen === "PaginaFiltros" ? "search" : "search-outline"}
          size={28}
          color={currentScreen === "PaginaFiltros" ? colors.primary : colors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
        <Ionicons
          name={currentScreen === "PaginaFavoritos" ? "heart" : "heart-outline"}
          size={28}
          color={currentScreen === "PaginaFavoritos" ? colors.primary : colors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaCarrinho")}>
        <Ionicons
          name={currentScreen === "PaginaCarrinho" ? "cart" : "cart-outline"}
          size={28}
          color={currentScreen === "PaginaCarrinho" ? colors.primary : colors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
        <Ionicons
          name={currentScreen === "PaginaPerfil" ? "person" : "person-outline"}
          size={28}
          color={currentScreen === "PaginaPerfil" ? colors.primary : colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function CatalogScreen({ navigation }) {
  const { colors } = useTheme(); // ⬅️ TEMA AQUI

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    tipos: 'Todos os tipos',
    materiais: 'Todos os materiais',
    precos: 'Todos os preços',
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async (filters, search = '') => {
    setLoading(true);

    let query = supabase.from('produtos').select('*');

    if (search.trim() !== '') {
      query = query.ilike('nome', `%${search}%`);
    }

    if (filters.tipos !== 'Todos os tipos') {
      query = query.eq('tipo', filters.tipos);
    }

    if (filters.materiais !== 'Todos os materiais') {
      query = query.eq('material', filters.materiais);
    }

    switch (filters.precos) {
      case 'Até R$500':
        query = query.lte('preco', 500);
        break;
      case 'R$500 a R$1.000':
        query = query.gt('preco', 500).lte('preco', 1000);
        break;
      case 'R$1.000 a R$1.500':
        query = query.gt('preco', 1000).lte('preco', 1500);
        break;
      case 'Acima de R$1.500':
        query = query.gt('preco', 1500);
        break;
    }

    const { data } = await query;
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(selectedFilters, search);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, selectedFilters]);

  const renderDropdown = (key) => (
    <View style={[styles.dropdownMenu, { backgroundColor: colors.card }]}>
      {filterOptions[key].map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.dropdownItem}
          onPress={() => {
            setSelectedFilters(prev => ({ ...prev, [key]: option }));
            setOpenDropdown(null);
          }}
        >
          <Text style={[styles.dropdownItemText, { color: colors.text }]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const filteredProducts = products;

  const renderFilterItem = (key, placeholder) => (
    <View style={styles.filterItemWrapper}>
      <TouchableOpacity
        style={[styles.filterDropdownButton, { backgroundColor: colors.card, borderColor: colors.text }]}
        onPress={() => setOpenDropdown(openDropdown === key ? null : key)}
      >
        <Text style={[styles.filterButtonText, { color: colors.text }]}>
          {selectedFilters[key] || placeholder}
        </Text>
        <Ionicons name={openDropdown === key ? "chevron-up" : "chevron-down"} size={20} color={colors.text} />
      </TouchableOpacity>

      {openDropdown === key && renderDropdown(key)}
    </View>
  );

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.filtersBox, { backgroundColor: colors.card }]}>
          <View style={styles.filtersHeader}>
            <Feather name="filter" size={18} color={colors.text} />
            <Text style={[styles.filtersTitle, { color: colors.text }]}>Filtros</Text>
          </View>

          {renderFilterItem('tipos', 'Todos os tipos')}
          {renderFilterItem('materiais', 'Todos os materiais')}
          {renderFilterItem('precos', 'Todos os preços')}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => <ProductCard key={p.id} product={p} navigation={navigation} />)
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: colors.text }}>
                Nenhum produto encontrado.
              </Text>
            )}
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
}

// ESTILOS ORIGINAIS (mantidos)
const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  priceCartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  scrollViewContent: { paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, paddingTop: 45 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 35, height: 35, borderRadius: 5, marginRight: 10, backgroundColor: '#7a4f9e' },
  logoText: { fontSize: 18, fontWeight: 'bold' },
  logoSubtitle: { fontSize: 12, marginTop: -3 },
  filtersBox: { marginHorizontal: 15, borderRadius: 10, padding: 15 },
  filtersHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  filtersTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  filterItemWrapper: { position: 'relative', marginBottom: 10 },
  filterDropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1 },
  filterButtonText: { fontSize: 15 },
  dropdownMenu: { position: 'absolute', top: '100%', left: 0, right: 0, borderRadius: 8, borderWidth: 1, borderTopWidth: 0, zIndex: 99, elevation: 20 },
  dropdownItem: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#444' },
  dropdownItemText: { fontSize: 15 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 20 },
  cardContainer: { width: screenWidth / 2 - 22, marginBottom: 15, borderRadius: 8, overflow: 'hidden', elevation: 2 },
  imageWrapper: { position: 'relative', width: '100%', height: screenWidth / 2 - 22 },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  favoriteIcon: { position: "absolute", top: 10, right: 10, borderRadius: 15, padding: 5 },
  cardDetails: { padding: 10, minHeight: 80 },
  productType: { fontSize: 13, marginBottom: 2 },
  productTitle: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  bottomNav: { height: 60, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 5, position: "absolute", bottom: 0, width: "100%" },
  navItem: { flex: 1, alignItems: "center" }
});
