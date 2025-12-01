// CarrinhoScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabaseClient";

// ======================= CORES ==========================
const COLORS = {
  primary: "#7a4f9e",
  secondary: "#474747",
  background: "#ffffff",
  lightGray: "#f4f4f4",
  border: "#e3e3e3",
  success: "#3fa55b",
  price: "#333333",
};

// ======================= ITEM DO CARRINHO ==========================
const ItemCarrinho = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <View style={itemStyles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={itemStyles.productImage} />

      <View style={itemStyles.detailsContainer}>
        {/* Nome + Material + Remover */}
        <View style={itemStyles.infoRow}>
          <View>
            <Text style={itemStyles.productName}>{item.nome}</Text>
            <Text style={GlobalStyles.textSmall}>{item.material}</Text>
          </View>

          <TouchableOpacity onPress={() => onRemove(item.carrinhoId)}>
            <Icon name="trash-2" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Quantidade + Preço */}
        <View style={itemStyles.actionsRow}>
          <View style={itemStyles.quantityControl}>
            <TouchableOpacity
              style={itemStyles.qtyButton}
              onPress={() =>
                onUpdateQuantity(item.carrinhoId, item.quantidade - 1)
              }
              disabled={item.quantidade <= 1}
            >
              <Text style={itemStyles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={itemStyles.qtyText}>{item.quantidade}</Text>

            <TouchableOpacity
              style={itemStyles.qtyButton}
              onPress={() =>
                onUpdateQuantity(item.carrinhoId, item.quantidade + 1)
              }
            >
              <Text style={itemStyles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={GlobalStyles.textPrice}>
            R${item.precoTotal.toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ======================= CALCULAR FRETE ==========================
const CalculoFrete = ({
  cep,
  endereco,
  setCep,
  setEndereco,
  frete,
  onCalculate,
}) => {
  return (
    <View style={GlobalStyles.card}>
      <View style={freteStyles.header}>
        <Icon name="truck" size={22} color={COLORS.primary} />
        <Text style={GlobalStyles.headerText}>Entrega</Text>
      </View>

      <Text style={GlobalStyles.textRegular}>CEP de Entrega</Text>

      <View style={freteStyles.cepInputRow}>
        <TextInput
          style={freteStyles.inputCep}
          placeholder="00000-000"
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
          maxLength={9}
        />
        <TouchableOpacity
          style={freteStyles.calculateButton}
          onPress={onCalculate}
        >
          <Text style={freteStyles.calculateButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text style={[GlobalStyles.textSmall, { marginTop: 6 }]}>
        {frete === null
          ? ""
          : frete === "Grátis"
          ? "Frete grátis aplicado!"
          : `Frete: R$ ${frete.toFixed(2)}`}
      </Text>

      <Text style={[GlobalStyles.textRegular, { marginTop: 15 }]}>
        Endereço Completo
      </Text>

      <TextInput
        style={freteStyles.inputFull}
        placeholder="Rua, número, bairro, cidade"
        value={endereco}
        onChangeText={setEndereco}
      />
    </View>
  );
};

// ======================= PÁGINA PRINCIPAL ==========================
const CarrinhoScreen = ({ navigation }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [frete, setFrete] = useState(null);
  const [pagamento, setPagamento] = useState("");

  const subtotal = carrinho.reduce((sum, item) => sum + item.precoTotal, 0);
  const total = subtotal + (frete === "Grátis" ? 0 : frete || 0);

  // --------- CARREGAR CARRINHO ---------
  useEffect(() => {
    carregarCarrinho();
  }, []);

  async function carregarCarrinho() {
    const { data: session } = await supabase.auth.getUser();
    if (!session || !session.user) return;

    const { data, error } = await supabase
      .from("carrinho")
      .select("id, quantidade, produtos(*)")
      .eq("user_id", session.user.id);

    if (error) return;

    const formatado = data.map((i) => ({
      carrinhoId: i.id,
      nome: i.produtos.nome,
      material: i.produtos.material,
      quantidade: i.quantidade,
      precoUnitario: i.produtos.preco,
      precoTotal: i.quantidade * i.produtos.preco,
      imageUrl: i.produtos.foto_url,
    }));

    setCarrinho(formatado);
  }

  // --------- FRETE VIA CEP ---------
  async function handleCalculateFrete() {
    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits.length !== 8) {
      Alert.alert("CEP inválido", "Digite um CEP válido com 8 dígitos.");
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await res.json();

      if (data.erro) {
        Alert.alert("CEP não encontrado", "Verifique o número informado.");
        return;
      }

      setEndereco(
        `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
      );

      if (subtotal >= 399.9) setFrete("Grátis");
      else setFrete(29.9);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar o CEP.");
    }
  }

  // --------- QUANTIDADE ---------
  async function handleUpdateQuantity(id, qtd) {
    if (qtd < 1) return;
    await supabase.from("carrinho").update({ quantidade: qtd }).eq("id", id);
    carregarCarrinho();
  }

  // --------- REMOVER ITEM ---------
  async function handleRemoveItem(id) {
    await supabase.from("carrinho").delete().eq("id", id);
    carregarCarrinho();
  }

  // --------- FINALIZAR COMPRA ---------
// --------- FINALIZAR COMPRA ---------
async function finalizarCompra() {
  try {
    if (carrinho.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione algum item.");
      return;
    }

    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits.length !== 8) {
      Alert.alert("CEP inválido", "Digite um CEP válido.");
      return;
    }

    if (!endereco || endereco.trim().length < 5) {
      Alert.alert("Endereço incompleto", "Preencha o endereço completo.");
      return;
    }

    if (!frete) {
      Alert.alert("Frete pendente", "Calcule o frete antes de finalizar.");
      return;
    }

    if (!pagamento) {
      Alert.alert("Pagamento", "Escolha uma forma de pagamento.");
      return;
    }

    // ========= PEGAR USUÁRIO =========
    const { data: session } = await supabase.auth.getUser();
    if (!session || !session.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    // --------- INSERIR PEDIDO NA TABELA ----------
    const { error } = await supabase.from("pedidos").insert([
      {
        user_id: session.user.id,
        cep: cep,
        endereco: endereco,
        metodo_pagamento: pagamento,
        subtotal: subtotal,
        frete: frete === "Grátis" ? 0 : frete,
        total: total,
        status: "Pendente",
      },
    ]);

    if (error) {
      console.log("ERRO AO CRIAR PEDIDO:", error);
      Alert.alert("Erro ao finalizar", "Não foi possível registrar o pedido.");
      return;
    }

    // --------- LIMPAR CARRINHO NO BANCO ----------
    await supabase.from("carrinho").delete().eq("user_id", session.user.id);

    // --------- LIMPAR CARRINHO NO ESTADO ----------
    setCarrinho([]);

    // --------- ALERT E REDIRECIONAMENTO ----------
    Alert.alert(
      "Pedido Finalizado 🎉",
      "Seu pedido foi registrado com sucesso!",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("paginaInicial"),
        },
      ]
    );
  } catch (e) {
    console.log("Erro final:", e);
    Alert.alert("Erro", "Ocorreu um problema ao finalizar.");
  }
}




  // --------- COMPONENTE PAGAMENTO ---------
  const MetodoPagamento = () => (
    <View style={GlobalStyles.card}>
      <Text style={GlobalStyles.headerText}>Pagamento</Text>

      {["Cartão de Crédito", "PIX", "Boleto"].map((m) => (
        <TouchableOpacity
          key={m}
          style={[
            styles.paymentOption,
            pagamento === m && styles.paymentOptionSelected,
          ]}
          onPress={() => setPagamento(m)}
        >
          <Text
            style={[
              styles.payText,
              pagamento === m && { color: COLORS.primary, fontWeight: "700" },
            ]}
          >
            {m}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ======================= RENDER ==========================
  return (
    <SafeAreaView style={GlobalStyles.container}>
      {/* HEADER */}
      <View style={mainStyles.header}>
        <View style={mainStyles.logoContainer}>
          <Image
            source={{
              uri: "https://via.placeholder.com/35/7a4f9e/ffffff?text=L",
            }}
            style={mainStyles.logoImage}
          />
          <View>
            <Text style={mainStyles.logoText}>Luz e Ouro</Text>
            <Text style={mainStyles.logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={mainStyles.scrollContent}>
        {/* LISTA */}
        <View style={[GlobalStyles.card, { paddingHorizontal: 0 }]}>
          {carrinho.length === 0 ? (
            <Text style={{ textAlign: "center", padding: 20 }}>
              Seu carrinho está vazio
            </Text>
          ) : (
            carrinho.map((item) => (
              <ItemCarrinho
                key={item.carrinhoId}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))
          )}
        </View>

        {/* FRETE */}
        <CalculoFrete
          cep={cep}
          setCep={setCep}
          endereco={endereco}
          setEndereco={setEndereco}
          frete={frete}
          onCalculate={handleCalculateFrete}
        />

        {/* PAGAMENTO */}
        <MetodoPagamento />

        {/* RESUMO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Frete:</Text>
            <Text style={styles.summaryValue}>
              {frete === "Grátis" ? "Grátis" : frete ? `R$ ${frete}` : "—"}
            </Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryTotal}>Total:</Text>
            <Text style={styles.summaryTotal}>
              R$ {total.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        {/* BOTÃO FINALIZAR */}
        <TouchableOpacity style={styles.payButton} onPress={finalizarCompra}>
          <Text style={styles.payButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={mainStyles.bottomNav}>
        <TouchableOpacity
          style={mainStyles.navItem}
          onPress={() => navigation.navigate("PaginaInicial")}
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={28}
            color={COLORS.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={mainStyles.navItem}
          onPress={() => navigation.navigate("PaginaFiltros")}
        >
          <Ionicons
            name="search-outline"
            size={28}
            color={COLORS.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={mainStyles.navItem}
          onPress={() => navigation.navigate("PaginaFavoritos")}
        >
          <Ionicons
            name="heart-outline"
            size={28}
            color={COLORS.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem}>
          <Ionicons name="cart" size={28} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={mainStyles.navItem}
          onPress={() => navigation.navigate("PaginaPerfil")}
        >
          <Ionicons
            name="person-outline"
            size={28}
            color={COLORS.secondary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ======================================================================
// ESTILOS
// ======================================================================

const mainStyles = StyleSheet.create({
  scrollContent: { paddingVertical: 18 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: COLORS.primary,
  },
  logoText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  logoSubtitle: { fontSize: 12, color: "#666", marginTop: -3 },

  bottomNav: {
    height: 65,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 5,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  navItem: { flex: 1, alignItems: "center" },
});

const GlobalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },
  textPrice: { fontSize: 16, fontWeight: "600", color: COLORS.price },
  textRegular: { fontSize: 14, color: COLORS.secondary },
  textSmall: { fontSize: 12, color: COLORS.secondary },
});

const itemStyles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingBottom: 12,
    marginHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  productImage: {
    width: 65,
    height: 65,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  detailsContainer: { flex: 1 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  productName: { fontSize: 15, fontWeight: "600", color: COLORS.price },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    alignItems: "center",
  },
  quantityControl: { flexDirection: "row", alignItems: "center" },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: { fontSize: 18, fontWeight: "700", color: COLORS.primary },
  qtyText: {
    width: 25,
    textAlign: "center",
    fontSize: 15,
    color: COLORS.price,
  },
});

const freteStyles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 6 },
  cepInputRow: { flexDirection: "row", marginTop: 6 },
  inputCep: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  calculateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  calculateButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  inputFull: {
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginTop: 6,
  },
});

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.primary,
  },
  paymentOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    backgroundColor: "#efe6f7",
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  payText: {
    fontSize: 15,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 15 },
  summaryValue: { fontSize: 15, fontWeight: "600" },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 80,
    borderRadius: 12,
    alignItems: "center",
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default CarrinhoScreen;