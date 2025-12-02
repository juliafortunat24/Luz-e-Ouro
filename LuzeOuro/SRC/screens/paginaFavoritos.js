import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";
import { useTheme } from "./ThemeContext";

export default function PaginaFavoritos({ navigation }) {
  const { colors } = useTheme();

  const [user, setUser] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------------
  // 1️⃣ Buscar usuário logado
  // ------------------------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        await carregarFavoritos(user.id);
      }
    };
    loadUser();
  }, []);

  // ------------------------------------------------------------------
  // 2️⃣ Buscar favoritos + produtos completos
  // ------------------------------------------------------------------
  const carregarFavoritos = async (userId) => {
    setLoading(true);

    // Buscar os favoritos do usuário
    const { data: favs, error } = await supabase
      .from("favoritos")
      .select("id_produto")
      .eq("id_usuario", userId);

    if (error) {
      console.error("Erro ao carregar favoritos:", error);
      setLoading(false);
      return;
    }

    if (favs.length === 0) {
      setFavoritos([]);
      setLoading(false);
      return;
    }

    // Buscar detalhes dos produtos relacionados
    const ids = favs.map((item) => item.id_produto);

    const { data: produtos, error: prodError } = await supabase
      .from("produtos")
      .select("id, nome, preco, material, tipo, foto_url")
      .in("id", ids);

    if (prodError) {
      console.error("Erro ao buscar produtos:", prodError);
    }

    // Formatar produtos para o card
    const formatados = produtos.map((item) => ({
      id: item.id,
      name: item.nome,
      type: item.material || item.tipo,
      price: `R$ ${parseFloat(item.preco).toFixed(2).replace(".", ",")}`,
      image: item.foto_url,
    }));

    setFavoritos(formatados);
    setLoading(false);
  };

  // ------------------------------------------------------------------
  // 3️⃣ Remover favorito individual
  // ------------------------------------------------------------------
  const removerFavorito = async (idProduto) => {
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("id_usuario", user.id)
      .eq("id_produto", idProduto);

    if (error) {
      console.error("Erro ao remover favorito:", error);
      return;
    }

    carregarFavoritos(user.id);
  };

  // ------------------------------------------------------------------
  // 4️⃣ Remover todos
  // ------------------------------------------------------------------
  const limparTodos = async () => {
    await supabase.from("favoritos").delete().eq("id_usuario", user.id);
    setFavoritos([]);
  };

  // ------------------------------------------------------------------
  // 5️⃣ Renderização
  // ------------------------------------------------------------------
  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#7a4f9e" />
      </View>
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={{ flex: 1 }}>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {favoritos.length} Itens Favoritados
          </Text>

          {favoritos.length > 0 && (
            <TouchableOpacity onPress={limparTodos}>
              <Text style={styles.clearAll}>Limpar tudo</Text>
            </TouchableOpacity>
          )}
        </View>

        {favoritos.length === 0 ? (
          <Text style={{ color: colors.text, textAlign: "center", marginTop: 20 }}>
            Nenhum item favoritado.
          </Text>
        ) : (
          favoritos.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>

              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={{ flex: 1 }}>
                <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.cardType, { color: "#7a4f9e" }]}>{item.type}</Text>
                <Text style={[styles.cardPrice, { color: colors.text }]}>{item.price}</Text>
              </View>

              <TouchableOpacity onPress={() => removerFavorito(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#7a4f9e" />
              </TouchableOpacity>

            </View>
          ))
        )}

        {/* BOTÃO CONTINUAR */}
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => navigation.navigate("PaginaInicial")}
        >
          <Text style={styles.exploreText}>Continuar explorando</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MENU INFERIOR */}
      <View style={[styles.bottomNav, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaInicial")}>
          <Ionicons name="home-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart" size={26} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={26} color="#7a4f9e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------
// 6️⃣ ESTILOS
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  clearAll: {
    color: "#7a4f9e",
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    alignItems: "center",
    gap: 15,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  cardName: {
    fontSize: 15,
    fontWeight: "700",
  },

  cardType: {
    fontSize: 12,
  },

  cardPrice: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "700",
  },

  exploreBtn: {
    marginHorizontal: 20,
    backgroundColor: "#7a4f9e",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },

  exploreText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },

  bottomNav: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});
