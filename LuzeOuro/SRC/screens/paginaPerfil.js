import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";


export default function PaginaPerfil({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buscar os dados reais do usuário no Supabase
  const fetchUserData = async () => {
    try {
      // 1. Pegando o usuário logado
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const user = authData.user;

      // 2. Buscar dados na tabela 'profiles'
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        Alert.alert("Erro ao carregar perfil", error.message);
        return;
      }

      // Gerar iniciais automaticamente
      const initials = data.full_name
        ? data.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?";

      setUserProfile({
        name: data.full_name,
        email: data.email,
        initials: initials,
        memberSince: new Date(data.created_at).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        totalOrders: 0,
        totalFavorites: 0,
      });

    } catch (err) {
      Alert.alert("Erro inesperado", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.replace("PaginaLogin");
  };

  if (loading || !userProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card do Usuário */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userProfile.initials}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <Text style={styles.userSince}>
              Cliente desde {userProfile.memberSince}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statCount}>{userProfile.totalOrders}</Text>
              <Text style={styles.statLabel}>Pedidos</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statCount}>{userProfile.totalFavorites}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
        </View>

        {/* Botões de ações */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => navigation.navigate("PaginaInicial")}
          >
            <Ionicons name="gift-outline" size={24} color="#7a4f9e" />
            <Text style={styles.quickAccessText}>Comprar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => navigation.navigate("PaginaFavoritos")}
          >
            <Ionicons name="heart-outline" size={24} color="#7a4f9e" />
            <Text style={styles.quickAccessText}>Favoritos</Text>
          </TouchableOpacity>
        </View>

        {/* Navegação inferior */}
        <View style={styles.navSection}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("DadosPessoais")}
          >
            <Ionicons name="person-outline" size={24} color="#555" />
            <Text style={styles.navItemText}>Dados Pessoais</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#555" />
            <Text style={styles.navItemText}>Sair da Conta</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navegação Bottom */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home-outline" size={28} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={28} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person" size={28} color="#7a4f9e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 45,
    backgroundColor: "#fff",
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#7a4f9e",
  },
  logoText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  logoSubtitle: { fontSize: 12, color: "#666", marginTop: -3 },

  profileCard: {
    backgroundColor: "#f5f5f5",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7a4f9e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  infoContainer: { alignItems: "center", marginBottom: 20 },
  userName: { fontSize: 18, fontWeight: "700", color: "#333" },
  userEmail: { fontSize: 14, color: "#666", marginTop: 2 },
  userSince: { fontSize: 12, color: "#999", marginTop: 4 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 15,
  },
  statBox: { alignItems: "center" },
  statCount: { fontSize: 22, fontWeight: "bold", color: "#7a4f9e" },
  statLabel: { fontSize: 14, color: "#666" },

  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  quickAccessButton: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  quickAccessText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#7a4f9e",
  },

  navSection: {
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  navItemText: { flex: 1, marginLeft: 15, fontSize: 16, color: "#333" },

  bottomNav: {
    height: 60,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});