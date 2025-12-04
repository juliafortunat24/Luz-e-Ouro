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

import { useTheme } from "./ThemeContext";
import { enviarNotificacao, registerForPushNotifications } from "../notificationService";


const CarrinhoScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();


  const ItemCarrinho = ({ item, onUpdateQuantity, onRemove }) => (
    <View style={[itemStyles.itemContainer, { borderBottomColor: colors.border }]}>
      <Image source={{ uri: item.imageUrl }} style={itemStyles.productImage} />
      <View style={itemStyles.detailsContainer}>
        <View style={itemStyles.infoRow}>
          <View>
            <Text style={[itemStyles.productName, { color: colors.title }]}>{item.nome}</Text>
            <Text style={[GlobalStyles.textSmall, { color: colors.text }]}>{item.material}</Text>
          </View>
          <TouchableOpacity onPress={() => onRemove(item.carrinhoId)}>
            <Icon name="trash-2" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={itemStyles.actionsRow}>
          <View style={itemStyles.quantityControl}>
            <TouchableOpacity
              style={[itemStyles.qtyButton, { borderColor: colors.border }]}
              onPress={() => onUpdateQuantity(item.carrinhoId, item.quantidade - 1)}
              disabled={item.quantidade <= 1}
            >
              <Text style={[itemStyles.qtyButtonText, { color: colors.primary }]}>-</Text>
            </TouchableOpacity>

            <Text style={[itemStyles.qtyText, { color: colors.title }]}>{item.quantidade}</Text>

            <TouchableOpacity
              style={[itemStyles.qtyButton, { borderColor: colors.border }]}
              onPress={() => onUpdateQuantity(item.carrinhoId, item.quantidade + 1)}
            >
              <Text style={[itemStyles.qtyButtonText, { color: colors.primary }]}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={[GlobalStyles.textPrice, { color: colors.title }]}>
            R${item.precoTotal.toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </View>
    </View>
  );

  const CalculoFrete = ({ cep, endereco, setCep, setEndereco, numeroResidencia, setNumeroResidencia, frete, onCalculate }) => (
    <View style={[GlobalStyles.card, { backgroundColor: colors.card }]}>
      <View style={freteStyles.header}>
        <Icon name="truck" size={22} color={colors.primary} />
        <Text style={[GlobalStyles.headerText, { color: colors.primary }]}>Entrega</Text>
      </View>

      <Text style={[GlobalStyles.textRegular, { color: colors.text }]}>CEP de Entrega</Text>
      <View style={freteStyles.cepInputRow}>
        <TextInput
          style={[freteStyles.inputCep, { borderColor: colors.border, backgroundColor: colors.input, color: colors.text }]}
          placeholder="00000-000"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
          maxLength={9}
        />
        <TouchableOpacity
          style={[freteStyles.calculateButton, { backgroundColor: colors.primary }]}
          onPress={onCalculate}
        >
          <Text style={freteStyles.calculateButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text style={[GlobalStyles.textSmall, { marginTop: 6, color: colors.text }]}>
        {frete === null ? "" :
          frete === "Grátis" ? "Frete grátis aplicado!" : `Frete: R$ ${frete.toFixed(2)}`
        }
      </Text>

      <Text style={[GlobalStyles.textRegular, { marginTop: 15, color: colors.text }]}>Endereço Completo</Text>
      <TextInput
        style={[freteStyles.inputFull, { borderColor: colors.border, backgroundColor: colors.input, color: colors.text }]}
        placeholder="Rua, bairro, cidade"
        placeholderTextColor={colors.placeholder}
        value={endereco}
        onChangeText={setEndereco}
      />

      <Text style={[GlobalStyles.textRegular, { marginTop: 15, color: colors.text }]}>Número da Residência</Text>
      <TextInput
        style={[freteStyles.inputFull, { borderColor: colors.border, backgroundColor: colors.input, color: colors.text }]}
        placeholder="Número"
        placeholderTextColor={colors.placeholder}
        value={numeroResidencia}
        onChangeText={setNumeroResidencia}
        keyboardType="numeric"
      />
    </View>
  );

  // ==================================================================
  // ESTADOS
  const [carrinho, setCarrinho] = useState([]);
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numeroResidencia, setNumeroResidencia] = useState("");
  const [frete, setFrete] = useState(null);
  const [pagamento, setPagamento] = useState("");
  const [cartaoNumero, setCartaoNumero] = useState("");
  const [cartaoValidade, setCartaoValidade] = useState("");
  const [cartaoCvv, setCartaoCvv] = useState("");

  const subtotal = carrinho.reduce((sum, item) => sum + item.precoTotal, 0);
  const total = subtotal + (frete === "Grátis" ? 0 : frete || 0);

  useEffect(() => {
    carregarCarrinho();
  }, []);

  useEffect(() => {
    registerForPushNotifications();
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

      setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);

      if (subtotal >= 399.9) setFrete("Grátis");
      else setFrete(29.9);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar o CEP.");
    }
  }

  async function handleUpdateQuantity(id, qtd) {
    if (qtd < 1) return;
    await supabase.from("carrinho").update({ quantidade: qtd }).eq("id", id);
    carregarCarrinho();
  }

  async function handleRemoveItem(id) {
    await supabase.from("carrinho").delete().eq("id", id);
    carregarCarrinho();
  }

  async function finalizarCompra() {

    if (carrinho.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione itens antes de finalizar a compra.");
      return;
    }

    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits.length !== 8) {
      Alert.alert("CEP obrigatório", "Informe um CEP válido para calcular o frete.");
      return;
    }

    if (frete === null) {
      Alert.alert("Frete não calculado", "Clique em 'Buscar' para calcular o frete.");
      return;
    }

    if (!endereco.trim()) {
      Alert.alert("Endereço obrigatório", "Informe o endereço completo.");
      return;
    }

    if (!numeroResidencia.trim()) {
      Alert.alert("Número obrigatório", "Informe o número da residência.");
      return;
    }

    if (!pagamento) {
      Alert.alert("Pagamento obrigatório", "Selecione um método de pagamento.");
      return;
    }

    if (pagamento === "Cartão de Crédito") {
      if (!cartaoNumero.trim() || cartaoNumero.length < 12) {
        Alert.alert("Cartão inválido", "Informe um número de cartão válido.");
        return;
      }
      if (!cartaoValidade.trim()) {
        Alert.alert("Validade obrigatória", "Informe a validade do cartão.");
        return;
      }
      if (!cartaoCvv.trim() || cartaoCvv.length < 3) {
        Alert.alert("CVV inválido", "Informe o código de segurança.");
        return;
      }
    }

    await enviarNotificacao(
      "Compra Finalizada! 🎉",
      "Seu pedido foi registrado com sucesso."
    );

    // -----------------------------
    // SALVAR PEDIDO NA TABELA
    // -----------------------------
    const { data: session } = await supabase.auth.getUser();
    if (!session || !session.user) return;

    const novoPedido = {
      user_id: session.user.id,
      cep,
      endereco: `${endereco}, Nº ${numeroResidencia}`,
      metodo_pagamento: pagamento,
      subtotal,
      frete: frete === "Grátis" ? 0 : frete,
      total,
      status: "Pendente"
    };

    const { error: pedidoError } = await supabase
      .from("pedidos")
      .insert([novoPedido]);

    if (pedidoError) {
      console.log("ERRO AO CRIAR PEDIDO:", pedidoError);
      Alert.alert("Erro", "Não foi possível registrar o pedido.");
      return;
    }

    // limpar carrinho
    await supabase.from("carrinho").delete().eq("user_id", session.user.id);

    setCarrinho([]);
    setCep("");
    setEndereco("");
    setNumeroResidencia("");
    setFrete(null);
    setPagamento("");
    setCartaoNumero("");
    setCartaoValidade("");
    setCartaoCvv("");

    Alert.alert("Pedido Finalizado", "Seu pedido foi enviado com sucesso!");
  }



  const MetodoPagamento = () => (
    <View style={[GlobalStyles.card, { backgroundColor: colors.card }]}>
      <Text style={[GlobalStyles.headerText, { color: colors.primary }]}>Pagamento</Text>

      {["Cartão de Crédito", "PIX"].map((m) => (
        <TouchableOpacity
          key={m}
          style={[
            styles.paymentOption,
            { borderColor: colors.border },
            pagamento === m && { backgroundColor: colors.highlight, borderColor: colors.primary }
          ]}
          onPress={() => setPagamento(m)}
        >
          <Text
            style={[
              styles.payText,
              { color: colors.text },
              pagamento === m && { color: colors.primary, fontWeight: "700" }
            ]}
          >
            {m}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Campos adicionais conforme o método */}
      {pagamento === "Cartão de Crédito" && (
        <View style={{ marginTop: 10 }}>
          <Text style={[GlobalStyles.textRegular, { color: colors.text }]}>Número do Cartão</Text>
          <TextInput
            style={[freteStyles.inputFull, { borderColor: colors.border, backgroundColor: colors.input, color: colors.text }]}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            value={cartaoNumero}
            onChangeText={setCartaoNumero}
          />

          <Text style={[GlobalStyles.textRegular, { color: colors.text, marginTop: 10 }]}>Validade</Text>
          <TextInput
            style={[freteStyles.inputFull, { borderColor: colors.border, backgroundColor: colors.input, color: colors.text }]}
            placeholder="MM/AA"
            placeholderTextColor={colors.placeholder}
            value={cartaoValidade}
            onChangeText={setCartaoValidade}
          />

          <Text style={[GlobalStyles.textRegular, { color: colors.text, marginTop: 10 }]}>CVV</Text>
          <TextInput
            style={[freteStyles.inputFull, { borderColor: colors.border, backgroundColor: colors.input, color: colors.text }]}
            placeholder="123"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            value={cartaoCvv}
            onChangeText={setCartaoCvv}
            secureTextEntry
          />
        </View>
      )}

      {pagamento === "PIX" && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Text style={[GlobalStyles.textRegular, { color: colors.text, marginBottom: 10 }]}>
            Escaneie o QR code para pagar via PIX
          </Text>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReXB6tvgHUw7BV-VIRDiLRjQDhFepQsGNxWA&s" }} // substitua pela URL do seu QR code
            style={{ width: 150, height: 150 }}
          />
        </View>
      )}
    </View>
  );

  // ============================= TELA ===============================
  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[mainStyles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={mainStyles.logoContainer}>
          <View>
            <Text style={[mainStyles.logoText, { color: colors.title }]}>Luz e Ouro</Text>
            <Text style={[mainStyles.logoSubtitle, { color: colors.text }]}>Joias e Acessórios</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={mainStyles.scrollContent}>
        {/* LISTA */}
        <View style={[GlobalStyles.card, { paddingHorizontal: 0, backgroundColor: colors.card }]}>
          {carrinho.length === 0 ? (
            <Text style={{ textAlign: "center", padding: 20, color: colors.text }}>
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
          numeroResidencia={numeroResidencia}
          setNumeroResidencia={setNumeroResidencia}
          frete={frete}
          onCalculate={handleCalculateFrete}
        />

        {/* PAGAMENTO */}
        <MetodoPagamento />

        {/* RESUMO */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Resumo do Pedido</Text>
          <View style={styles.summaryLine}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Subtotal:</Text>
            <Text style={[styles.summaryValue, { color: colors.title }]}>
              R$ {subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Frete:</Text>
            <Text style={[styles.summaryValue, { color: colors.title }]}>
              {frete === "Grátis" ? "Grátis" : frete ? `R$ ${frete}` : "—"}
            </Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={[styles.summaryTotal, { color: colors.primary }]}>Total:</Text>
            <Text style={[styles.summaryTotal, { color: colors.primary }]}>
              R$ {total.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        {/* BOTÃO FINALIZAR */}
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: colors.primary }]}
          onPress={finalizarCompra}
        >
          <Text style={styles.payButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={[mainStyles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home-outline" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={mainStyles.navItem}>
          <Ionicons name="cart" size={28} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const mainStyles = StyleSheet.create({
  scrollContent: { paddingVertical: 18 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingTop: 45, paddingBottom: 12, borderBottomWidth: 1 },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoText: { fontSize: 18, fontWeight: "bold" },
  logoSubtitle: { fontSize: 12, marginTop: -3 },
  bottomNav: { height: 65, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 5, position: "absolute", left: 0, right: 0, bottom: 0 },
  navItem: { flex: 1, alignItems: "center" },
});

const GlobalStyles = StyleSheet.create({
  container: { flex: 1 },
  card: { borderRadius: 10, marginHorizontal: 15, marginBottom: 15, padding: 15, elevation: 2 },
  headerText: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  textPrice: { fontSize: 16, fontWeight: "600" },
  textRegular: { fontSize: 14 },
  textSmall: { fontSize: 12 },
});

const itemStyles = StyleSheet.create({
  itemContainer: { flexDirection: "row", paddingBottom: 12, marginHorizontal: 15, marginBottom: 10, borderBottomWidth: 1 },
  productImage: { width: 65, height: 65, borderRadius: 6, marginRight: 12, backgroundColor: "#eee" },
  detailsContainer: { flex: 1 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  productName: { fontSize: 15, fontWeight: "600" },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4, alignItems: "center" },
  quantityControl: { flexDirection: "row", alignItems: "center" },
  qtyButton: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  qtyButtonText: { fontSize: 18, fontWeight: "700" },
  qtyText: { width: 25, textAlign: "center", fontSize: 15 },
});

const freteStyles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 6 },
  cepInputRow: { flexDirection: "row", marginTop: 6 },
  inputCep: { flex: 1, height: 42, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10 },
  calculateButton: { paddingHorizontal: 16, height: 42, borderRadius: 6, justifyContent: "center", alignItems: "center", marginLeft: 10 },
  calculateButtonText: { color: "#fff", fontWeight: "700" },
  inputFull: { height: 42, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, marginTop: 6 },
});

const styles = StyleSheet.create({
  section: { margin: 15, padding: 15, borderRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  paymentOption: { padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 10 },
  payText: { fontSize: 15 },
  summaryLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 15 },
  summaryValue: { fontSize: 15, fontWeight: "600" },
  summaryTotal: { fontSize: 18, fontWeight: "700" },
  payButton: { paddingVertical: 18, marginHorizontal: 20, marginBottom: 80, borderRadius: 12, alignItems: "center" },
  payButtonText: { color: "#ffffff", fontSize: 17, fontWeight: "700" },
});

export default CarrinhoScreen;