import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient';
import { useTheme } from "./ThemeContext";

const categories = [
  { id: "4", name: "Brincos", icon: "diamond", screen: "PaginaBrincos" },
  { id: "2", name: "Colares", icon: "necklace", screen: "PaginaColares" },
  { id: "1", name: "Anéis", icon: "ring", screen: "PaginaAneis" },
  { id: "3", name: "Relógios", icon: "watch", screen: "PaginaRelogios" },
];



export default function App({ navigation }) {

  const { colors } = useTheme();

  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('produtos')
      .select('id, nome, preco, material, tipo, foto_url')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      setLoading(false);
      return;
    }

    if (data) {
      const formattedProducts = data.map(item => ({
        id: item.id,
        type: item.material,
        name: item.nome,
        price: `R$ ${parseFloat(item.preco).toFixed(2).replace('.', ',')}`,
        image: item.foto_url || "https://placehold.co/200x200?text=Sem+Imagem",
      }));

      setProducts(formattedProducts);
    }

    setLoading(false);
  };

  const fetchFavorites = async (userId) => {
    const { data, error } = await supabase
      .from("favoritos")
      .select("id_produto")
      .eq("id_usuario", userId);

    if (error) {
      console.log("Erro ao carregar favoritos:", error);
      return;
    }

    setFavorites(data.map(item => item.id_produto));
  };

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        await fetchFavorites(user.id);
      }

      await fetchProducts();
    };

    initialize();
  }, []);

  const toggleFavorite = async (id_produto) => {
    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para favoritar.");
      return;
    }

    const isFav = favorites.includes(id_produto);

    if (isFav) {
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("id_usuario", user.id)
        .eq("id_produto", id_produto);

      if (error) {
        console.log("Erro ao remover favorito:", error);
        return;
      }

      setFavorites(prev => prev.filter(item => item !== id_produto));

    } else {
      const { error } = await supabase
        .from("favoritos")
        .insert({
          id_usuario: user.id,
          id_produto: id_produto
        });

      if (error) {
        console.log("Erro ao adicionar favorito:", error);
        return;
      }

      setFavorites(prev => [...prev, id_produto]);

      // 🚀 ABRE A TELA DE FAVORITOS IMEDIATAMENTE
      navigation.navigate("PaginaFavoritos");
    }
  };
  const ProductCard = ({ product }) => {

    const adicionarAoCarrinho = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          Alert.alert("Atenção", "Você precisa estar logado para adicionar ao carrinho.");
          return;
        }

        const { data: existente, error: selectError } = await supabase
          .from("carrinho")
          .select("*")
          .eq("user_id", user.id)
          .eq("produto_id", product.id)
          .maybeSingle();

        if (selectError) {
          console.error("Erro ao verificar carrinho:", selectError);
          return;
        }

        if (existente) {
          await supabase
            .from("carrinho")
            .update({ quantidade: existente.quantidade + 1 })
            .eq("id", existente.id);
        } else {
          await supabase
            .from("carrinho")
            .insert({
              user_id: user.id,
              produto_id: product.id,
              quantidade: 1
            });
        }

        navigation.navigate("PaginaCarrinho");

      } catch (err) {
        console.error("Erro ao adicionar ao carrinho:", err);
      }
    };

    return (
      <View style={styles(colors).productCard}>
        <View style={{ backgroundColor: colors.card }}>

          <Image
            source={{ uri: product.image }}
            style={styles(colors).productImage}
            resizeMode="cover"
          />

          {/* FAVORITO */}
          <TouchableOpacity
            style={styles(colors).favoriteIcon}
            onPress={() => toggleFavorite(product.id)}
          >
            <Ionicons
              name={favorites.includes(product.id) ? "heart" : "heart-outline"}
              size={20}
              color={favorites.includes(product.id) ? "#7a4f9e" : colors.text}
            />
          </TouchableOpacity>

          {/* CARRINHO */}
          <TouchableOpacity
            style={{ position: "absolute", bottom: 10, right: 10 }}
            onPress={adicionarAoCarrinho}
          >
            <Ionicons name="cart-outline" size={24} color="#7a4f9e" />
          </TouchableOpacity>

        </View>

        <View style={styles(colors).productInfo}>
          <Text style={styles(colors).productType}>{product.type}</Text>
          <Text style={styles(colors).productName}>{product.name}</Text>
          <Text style={styles(colors).productPrice}>{product.price}</Text>
        </View>
      </View>
    );
  };


  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles(colors).categoryItem}
      onPress={() => navigation.navigate(item.screen)}
    >
      <MaterialCommunityIcons name={item.icon} size={36} color="#7a4f9e" />
      <Text style={styles(colors).categoryLabel}>{item.name}</Text>
    </TouchableOpacity>
  );


  const renderProductItem = ({ item }) => (
    <ProductCard product={item} />
  );

  const renderAdminButton = () => {
    if (user?.email === "admin@admin.com") {
      return (
        <TouchableOpacity
          style={styles(colors).adminButton}
          onPress={() => navigation.navigate("CadastroProdutos")}
        >
          <Text style={styles(colors).adminButtonText}>Adicionar Produtos</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };


  return (
    <View style={styles(colors).container}>

      {/* HEADER */}
      <View style={styles(colors).header}>
        <View style={styles(colors).logoContainer}>
          <View>
            <Text style={styles(colors).logoText}>Luz e Ouro</Text>
            <Text style={styles(colors).logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>

      {/* SCROLL TOTAL */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* CARROSSEL */}
        <FlatList
          data={[
            { id: "1", image: require('../../assets/banner1.jpeg') },
            { id: "2", image: require('../../assets/banner2.jpeg') },
            { id: "3", image: require('../../assets/banner3.jpeg') },
          ]}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles(colors).carouselItem}>
              <Image source={item.image} style={styles(colors).carouselImage} />
            </View>
          )}
          style={styles(colors).carouselContainer}
        />

        <Text style={styles(colors).sectionTitle}>Categorias</Text>

        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#7a4f9e" style={{ marginTop: 50 }} />
        ) : (
          <>
            <Text style={styles(colors).sectionTitle}>Produtos em Destaque</Text>

            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            <Text style={styles(colors).sectionTitle}>
              Lançamentos <Text style={{ color: "#7a4f9e", fontWeight: "700" }}>NOVO</Text>
            </Text>

            <FlatList
              data={products.slice(0, 2)}
              renderItem={renderProductItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
            />
          </>
        )}

        {renderAdminButton()}

      </ScrollView>

      {/* MENU INFERIOR */}
      <View style={styles(colors).bottomNav}>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={28} color="#7a4f9e" />
        </TouchableOpacity>
      </View>

    </View>
  );
}


/* ESTILOS */
const styles = (colors) => StyleSheet.create({

  container: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 45,
    backgroundColor: colors.background,
  },

  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoText: { fontSize: 18, fontWeight: "bold", color: colors.text },
  logoSubtitle: { fontSize: 12, color: colors.text },

  carouselContainer: { height: 200, marginVertical: 15 },
  carouselItem: {
    width: 360,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
    backgroundColor: colors.card,
  },
  carouselImage: { width: "100%", height: "100%" },

  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 5,
    color: colors.text,
  },

  categoryItem: { alignItems: "center", justifyContent: "center", marginHorizontal: 20 },
  categoryLabel: { color: "#7a4f9e", marginTop: 8, fontWeight: "600" },

  productCard: {
    flex: 1,
    backgroundColor: colors.card,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  productImage: { width: "100%", height: 160 },

  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: colors.background,
    borderRadius: 20,
  },

  productInfo: { padding: 12 },
  productType: { color: "#7a4f9e", fontWeight: "600" },
  productName: { fontWeight: "700", color: colors.text },
  productPrice: { color: colors.text, fontWeight: "700", fontSize: 16 },

  adminButton: {
    backgroundColor: "#7a4f9e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  adminButtonText: { color: "#fff", fontWeight: "700" },

  bottomNav: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: colors.card,
    backgroundColor: colors.background,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 5,
  },

  navItem: { flex: 1, alignItems: "center" },
});
