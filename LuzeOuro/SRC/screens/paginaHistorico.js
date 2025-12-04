import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";
import { useTheme } from "./ThemeContext";

export default function PaginaHistorico({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user.id;

      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("user_id", userId)
        .order("criado_em", { ascending: false });

      if (error) console.log(error);

      setPedidos(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Histórico de Pedidos
        </Text>

        <View style={{ width: 25 }} />
      </View>

      {/* LISTA */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : pedidos.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Nenhum pedido encontrado.
        </Text>
      ) : (
        <ScrollView style={{ padding: 15 }}>
          {pedidos.map((p) => (
            <View key={p.id} style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.title, { color: colors.primary }]}>
                Pedido #{p.id.slice(0, 8)}
              </Text>

              <Text style={[styles.text, { color: colors.text }]}>
                Endereço: {p.endereco}
              </Text>

              <Text style={[styles.text, { color: colors.text }]}>
                CEP: {p.cep}
              </Text>

              <Text style={[styles.text, { color: colors.text }]}>
                Total: R$ {p.total.toFixed(2)}
              </Text>

              <Text style={[styles.text, { color: colors.text }]}>
                Status: {p.status}
              </Text>

              <Text style={[styles.date, { color: colors.text }]}>
                {new Date(p.criado_em).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  text: { fontSize: 14, marginTop: 4 },
  date: { marginTop: 8, fontSize: 12, opacity: 0.7 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16 },
});
