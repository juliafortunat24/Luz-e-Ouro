import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";
import { useTheme } from "./ThemeContext";

export default function PaginaPerfil({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { colors, toggleTheme, isDark } = useTheme();
  const borderColor = isDark ? "#3a3a3a" : "#eee";
  const dividerColor = isDark ? "#3a3a3a" : "#ddd";

  const fetchUserData = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const user = authData.user;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        Alert.alert("Erro ao carregar perfil", error.message);
        return;
      }

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
        initials,
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
    navigation.replace("Login");
  };

  if (loading || !userProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botão de alternar tema */}
      <TouchableOpacity
        style={[
          styles.themeButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={toggleTheme}
      >
        <Text style={styles.themeButtonText}>
          {isDark ? "Tema Claro" : "Tema Escuro"}
        </Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={[styles.header]}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/35/7a4f9e/ffffff?text=L" }}
            style={[styles.logoImage, { backgroundColor: colors.primary }]}
          />
          <View>
            <Text style={[styles.logoText, { color: colors.text }]}>Luz e Ouro</Text>
            <Text style={[styles.logoSubtitle, { color: colors.text }]}>
              Joias e Acessórios
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card do Usuário */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{userProfile.initials}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.userName, { color: colors.text }]}>{userProfile.name}</Text>
            <Text style={[styles.userEmail, { color: colors.text }]}>{userProfile.email}</Text>
            <Text style={[styles.userSince, { color: colors.text }]}>
              Cliente desde {userProfile.memberSince}
            </Text>
          </View>

          <View style={[styles.statsRow, { borderTopColor: dividerColor }]}>
            <View style={styles.statBox}>
              <Text style={[styles.statCount, { color: colors.primary }]}>
                {userProfile.totalOrders}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Pedidos</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statCount, { color: colors.primary }]}>
                {userProfile.totalFavorites}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Favoritos</Text>
            </View>
          </View>
        </View>

        {/* Botões de ações */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={[styles.quickAccessButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("PaginaInicial")}
          >
            <Ionicons name="gift-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickAccessText, { color: colors.primary }]}>Comprar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAccessButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("PaginaFavoritos")}
          >
            <Ionicons name="heart-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickAccessText, { color: colors.primary }]}>Favoritos</Text>
          </TouchableOpacity>
        </View>

        {/* Navegação inferior (seção de opções) */}
        <View style={[styles.navSection, { backgroundColor: colors.card, borderColor }]}>
          <TouchableOpacity
            style={[styles.navItem, { borderBottomColor: borderColor }]}
            onPress={() => navigation.navigate("DadosPessoais")}
          >
            <Ionicons name="person-outline" size={24} color={colors.text} />
            <Text style={[styles.navItemText, { color: colors.text }]}>Dados Pessoais</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, { borderBottomColor: "transparent" }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.text} />
            <Text style={[styles.navItemText, { color: colors.text }]}>Sair da Conta</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navegação Bottom */}
      <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: dividerColor }]}>
        <TouchableOpacity onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home-outline" size={28} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart-outline" size={28} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  themeButton: {
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-end",
    margin: 15,
  },
  themeButtonText: { color: "#fff", fontWeight: "bold" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 45,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    marginRight: 10,
  },
  logoText: { fontSize: 18, fontWeight: "bold" },
  logoSubtitle: { fontSize: 12, marginTop: -3 },

  profileCard: {
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "bold" },

  infoContainer: { alignItems: "center", marginBottom: 20 },
  userName: { fontSize: 18, fontWeight: "700" },
  userEmail: { fontSize: 14, marginTop: 2 },
  userSince: { fontSize: 12, marginTop: 4 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderTopWidth: 1,
    paddingTop: 15,
  },
  statBox: { alignItems: "center" },
  statCount: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 14 },

  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  quickAccessButton: {
    flexDirection: "row",
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
  },

  navSection: {
    marginHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  navItemText: { flex: 1, marginLeft: 15, fontSize: 16 },

  bottomNav: {
    height: 60,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
