import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient'; // Importação correta do cliente Supabase

const categories = [
  { id: "1", name: "Anéis", icon: "diamond", screen: "PaginaAneis" },
  { id: "2", name: "Colares", icon: "star", screen: "PaginaColares" },
  { id: "3", name: "Relógios", icon: "clock", screen: "PaginaRelogios" },
  { id: "4", name: "Brincos", icon: "crown", screen: "PaginaBrincos" },
];

 

export default function App({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  // ⭐️ Novo estado para armazenar os produtos do Supabase
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    // ⚠️ Atenção: 'public.produtos' é o nome da sua tabela que aparece nas imagens
    // Certifique-se de que o nome da tabela está correto.
    const { data, error } = await supabase
      .from('produtos')
      .select('id, nome, preco, material, tipo, foto_url') // Seleciona as colunas necessárias
      .order('id', { ascending: false }); // Exemplo: ordena pelo 'id'

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      setLoading(false);
      return;
    }

    if (data) {
      // Mapeia os dados do Supabase para o formato esperado pelo seu `renderProductItem`
      const formattedProducts = data.map(item => ({
        id: item.id,
        // Certifique-se de que os nomes das colunas aqui (item.nome, item.preco, etc.) 
        // correspondem exatamente aos nomes no seu banco (nome, preco, material, tipo, foto).
        type: item.material, // Usando 'material' como 'type'
        name: item.nome,
        price: `R$ ${parseFloat(item.preco).toFixed(2).replace('.', ',')}`, // Formata o preço
        image: item.foto_url || "https://placehold.co/200x200?text=Sem+Imagem",
      }));

      setProducts(formattedProducts);
    }
    setLoading(false);
  };

  // Pega usuário logado do Supabase e busca os produtos
  useEffect(() => {
    const initializeData = async () => {
      // Pega usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Busca os produtos
      await fetchProducts();
    };
    initializeData();
  }, []);

  // Filtra produtos para simular 'Destaques' e 'Lançamentos'
  const featuredProducts = products; // Exemplo: os 4 primeiros produtos
  const launches = products.filter((_, index) => index < 2); // Exemplo: os 2 primeiros produtos

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate(item.screen)}
    >
      <MaterialCommunityIcons name={item.icon} size={36} color="#7a4f9e" />
      <Text style={styles.categoryLabel}>{item.name}</Text>
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
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
        onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
      />

      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => {
          toggleFavorite(item.id);
          navigation.navigate("PaginaFavoritos", { produto: item });
        }}
      >
        <Ionicons
          name={favorites.includes(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={favorites.includes(item.id) ? "#7a4f9e" : "#aaa"}
        />
      </TouchableOpacity>

      {/* Ícone de carrinho sem fundo */}
      <TouchableOpacity
        style={{ position: "absolute", bottom: 10, right: 10 }}
        onPress={() => addToCart(item)}
      >
        <Ionicons name="cart-outline" size={24} color="#7a4f9e" />
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <Text style={styles.productType}>{item.type}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </View>
  );

  const renderAdminButton = () => {
    if (user?.email === "admin@admin.com") {
      return (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate("CadastroProdutos")}
        >
          <Text style={styles.adminButtonText}>Adicionar Produtos</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* ... Header e Carrossel ... */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/*<Image
            source={{ uri: 'https://via.placeholder.com/30/8a2be2/ffffff?text=L' }}
            style={styles.logoImage}
          /> */}
          <View>
            <Text style={styles.logoText}>Luz e Ouro</Text>
            <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Carrossel de imagens locais */}
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
            <View style={styles.carouselItem}>
              <Image source={item.image} style={styles.carouselImage} />
            </View>
          )}
          style={styles.carouselContainer}
        />

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        {/* Exibe o indicador de carregamento ou a lista de produtos */}
        {loading ? (
          <ActivityIndicator size="large" color="#7a4f9e" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Produtos em destaque */}
            <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
            <FlatList
              data={featuredProducts} // Agora usa os produtos buscados
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            {/* Lançamentos */}
            <Text style={styles.sectionTitle}>
              Lançamentos <Text style={{ fontWeight: "700", color: "#7a4f9e" }}>NOVO</Text>
            </Text>
            <FlatList
              data={launches} // Agora usa os produtos buscados
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
            />
          </>
        )}

        {/* Botão admin */}
        {renderAdminButton()}
      </ScrollView>

      {/* ... Bottom Navigation ... */}
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

// --- Estilos (Não alterados) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  logoImage: { width: 35, height: 35, borderRadius: 5, marginRight: 10, backgroundColor: '#7a4f9e' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logoSubtitle: { fontSize: 12, color: '#666', marginTop: -3 },

  carouselContainer: {
    height: 200,
    marginVertical: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  carouselItem: {
    width: 360,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
    backgroundColor: "#f2f2f2",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  sectionTitle: { fontWeight: "700", fontSize: 18, marginLeft: 15, marginTop: 5 },
  categoryItem: { alignItems: "center", justifyContent: "center", marginHorizontal: 20, paddingVertical: 10 },
  categoryLabel: { color: "#7a4f9e", marginTop: 8, fontWeight: "600", fontSize: 14 },

  productCard: { flex: 1, backgroundColor: "#f9f8fb", margin: 8, borderRadius: 12, overflow: "hidden", position: "relative" },
  productImage: { width: "100%", height: 160, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  favoriteIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#fff", borderRadius: 15, padding: 5 },
  productInfo: { padding: 12 },
  productType: { color: "#7a4f9e", fontWeight: "600", marginBottom: 3 },
  productName: { fontWeight: "700", marginBottom: 4 },
  productPrice: { color: "#4a4a4a", fontWeight: "700", fontSize: 16 },

  adminButton: {
    backgroundColor: "#7a4f9e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  adminButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  bottomNav: { height: 60, borderTopWidth: 1, borderTopColor: "#ddd", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 5 },
  navItem: { flex: 1, alignItems: "center" },
});