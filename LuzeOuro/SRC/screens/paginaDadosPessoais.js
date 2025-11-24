import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  primary: "#7a4f9e",
  secondary: "#333",
  background: "#FFFFFF",
  lightGray: "#F5F5F5",
  border: "#E0E0E0",
};

const DadosPessoais = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [iniciais, setIniciais] = useState("?");

  // ---------------------------
  // 🔥 CARREGAR DADOS DO USUÁRIO
  // ---------------------------
  const carregarDados = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        return;
      }

      const user = authData.user;
      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        Alert.alert("Erro ao carregar perfil", error.message);
        return;
      }

      setNome(profile.full_name || "");
      setEmail(profile.email || "");

      const ini = profile.full_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      setIniciais(ini || "?");
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // ---------------------------
  // 🔥 SALVAR ALTERAÇÕES
  // ---------------------------
  const handleSalvar = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      // Atualizar nome e email no Supabase
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: nome,
          email: email,
          updated_at: new Date(),
        })
        .eq("id", userId);

      if (updateError) {
        Alert.alert("Erro ao salvar", updateError.message);
        return;
      }

      // Atualizar senha (opcional)
      if (senhaAtual && novaSenha) {
        const { error: pwdError } = await supabase.auth.updateUser({
          password: novaSenha,
        });

        if (pwdError) {
          Alert.alert("Erro ao alterar senha", pwdError.message);
          return;
        }
      }

      Alert.alert("Sucesso", "Alterações salvas com sucesso!");

    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://via.placeholder.com/30/8a2be2/ffffff?text=L",
            }}
            style={styles.logoImage}
          />
          <View>
            <Text style={styles.logoText}>Luz e Ouro</Text>
            <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>

          {/* AVATAR */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>

          {/* Nome */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome completo:</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} />
          </View>

          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          {/* Senha atual */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha atual:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />
          </View>

          {/* Nova senha */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nova senha:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
          </View>

          {/* BOTÃO SALVAR */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleSalvar}>
            <Text style={styles.confirmButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
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
          <Ionicons name="person" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 80, alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 45,
    backgroundColor: COLORS.background,
  },

  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: {
    width: 35, height: 35, borderRadius: 5,
    marginRight: 10, backgroundColor: COLORS.primary,
  },
  logoText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  logoSubtitle: { fontSize: 12, color: "#666" },

  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
  },

  avatarContainer: {
    width: 95, height: 95, borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center",
    marginBottom: 25,
  },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "bold" },

  formGroup: { width: "100%", marginBottom: 15 },
  label: { fontSize: 14, color: "#333", marginBottom: 5 },

  input: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff", fontSize: 16, fontWeight: "bold",
  },

  bottomNav: {
    height: 60, borderTopWidth: 1,
    borderColor: "#ddd", flexDirection: "row",
    justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default DadosPessoais;