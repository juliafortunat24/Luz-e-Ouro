import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native'; // ✅ Import necessário

// --- CORES ---
const COLORS = {
  primary: '#7a4f9e',
  secondary: '#333',
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  border: '#E0E0E0',
  success: '#388E3C',
  price: '#333333',
};

// --- DADOS INICIAIS ---
const DADOS_CARRINHO_INICIAL = [
  { 
    id: '1', 
    nome: 'Conjunto Colares', 
    metal: 'Prata', 
    quantidade: 1, 
    precoUnitario: 548.90, 
    precoTotal: 548.90, 
    imageUrl: 'https://cdn.sistemawbuy.com.br/arquivos/625ef789af258e29105f73822b9ad450/produtos/6661f0d01975a/mix-de-colares-trio-reluzente-6661f0d11ecec.jpg' 
  },
  { 
    id: '2', 
    nome: 'Anel com Turmalina', 
    metal: 'Ouro branco', 
    quantidade: 1, 
    precoUnitario: 1090.90, 
    precoTotal: 1090.90, 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHcZlJUe0vFNCs3NM_rg1Iu2Ka7SoTgAUbfQ&s' 
  },
];

// --- COMPONENTES ---
const ItemCarrinho = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <View style={itemStyles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={itemStyles.productImage} />
      <View style={itemStyles.detailsContainer}>
        <View style={itemStyles.infoRow}>
          <View>
            <Text style={itemStyles.productName}>{item.nome}</Text>
            <Text style={GlobalStyles.textSmall}>{item.metal}</Text>
          </View>
          <TouchableOpacity onPress={() => onRemove(item.id)}> 
            <Icon name="trash-2" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
        <View style={itemStyles.actionsRow}>
          <View style={itemStyles.quantityControl}>
            <TouchableOpacity 
              style={itemStyles.qtyButton} 
              onPress={() => onUpdateQuantity(item.id, item.quantidade - 1)}
              disabled={item.quantidade <= 1}
            >
              <Text style={itemStyles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={itemStyles.qtyText}>{item.quantidade}</Text>
            <TouchableOpacity 
              style={itemStyles.qtyButton} 
              onPress={() => onUpdateQuantity(item.id, item.quantidade + 1)}
            >
              <Text style={itemStyles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={GlobalStyles.textPrice}>
            R${item.precoTotal.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const CalculoFrete = ({ cep, setCep, endereco, setEndereco, onCalculate, subtotal }) => {
  return (
    <View style={GlobalStyles.card}>
      <View style={freteStyles.header}>
        <Icon name="truck" size={20} color={COLORS.primary} style={{ marginRight: 5 }} />
        <Text style={GlobalStyles.headerText}>Calcular Frete</Text>
      </View>
      <View style={freteStyles.inputGroup}>
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
          <TouchableOpacity style={freteStyles.calculateButton} onPress={onCalculate}>
            <Text style={freteStyles.calculateButtonText}>Calcular</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={freteStyles.inputGroup}>
        <Text style={GlobalStyles.textRegular}>Endereço Completo</Text>
        <TextInput
          style={freteStyles.inputFull}
          placeholder="Rua, número, bairro, cidade"
          value={endereco}
          onChangeText={setEndereco}
        />
      </View>
      <View style={freteStyles.freteVantagens}>
        <Text style={{...GlobalStyles.textRegular, fontWeight: 'bold'}}>Vantagens do Frete</Text>
        <Text style={GlobalStyles.textSmall}>• Frete grátis PAC para compras acima de R$ 399,90</Text>
        <Text style={GlobalStyles.textSmall}>• Frete grátis SEDEX para compras acima de R$ 990,00</Text>
      </View>
    </View>
  );
};

const ResumoPedido = ({ subtotal, frete, total, onFinish, onContinue }) => {
  const freteGratis = frete === 'Grátis';
  return (
    <View style={[GlobalStyles.card, {marginBottom: 100}]}>
      <Text style={GlobalStyles.headerText}>Resumo do Pedido</Text>
      <View style={resumoStyles.summaryRow}>
        <Text style={GlobalStyles.textRegular}>Subtotal</Text>
        <Text style={GlobalStyles.textRegular}>R${subtotal.toFixed(2).replace('.', ',')}</Text>
      </View>
      <View style={resumoStyles.summaryRow}>
        <Text style={GlobalStyles.textRegular}>Frete</Text>
        <Text style={freteGratis ? resumoStyles.freteGratisText : GlobalStyles.textRegular}>
          {freteGratis ? frete : `R$ ${frete.toFixed(2).replace('.', ',')}`}
        </Text>
      </View>
      <View style={resumoStyles.separator} />
      <View style={resumoStyles.summaryRow}>
        <Text style={resumoStyles.totalText}>TOTAL</Text>
        <Text style={resumoStyles.totalText}>R${total.toFixed(2).replace('.', ',')}</Text>
      </View>
      <TouchableOpacity style={resumoStyles.finishButton} onPress={onFinish}>
        <Text style={resumoStyles.finishButtonText}>Finalizar Compra</Text>
      </TouchableOpacity>
      <TouchableOpacity style={resumoStyles.continueButton} onPress={onContinue}>
        <Text style={resumoStyles.continueButtonText}>Continuar Comprando</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- CARRINHO SCREEN ---
const CarrinhoScreen = ({ navigation }) => {
  const route = useRoute();
  const currentScreen = route.name;

  const [carrinho, setCarrinho] = useState(DADOS_CARRINHO_INICIAL);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [frete, setFrete] = useState('Grátis');

  const subtotal = carrinho.reduce((sum, item) => sum + item.precoTotal, 0);
  const total = subtotal + (frete === 'Grátis' ? 0 : frete);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCarrinho(prev => prev.map(item =>
      item.id === id ? { ...item, quantidade: newQuantity, precoTotal: newQuantity * item.precoUnitario } : item
    ));
  };

  const handleRemoveItem = (id) => setCarrinho(prev => prev.filter(item => item.id !== id));

  const handleCalculateFrete = () => {
    if (subtotal > 399.90) setFrete('Grátis');
    else setFrete(25.50);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {/* Header */}
      <View style={mainStyles.header}>
        <View style={mainStyles.logoContainer}>
          <View style={mainStyles.logoBox}>
            <Text style={mainStyles.logoText}>Luz e Ouro</Text>
          </View>
          <Text style={mainStyles.subtitle}>Joias e Acessórios</Text>
        </View>
        <TouchableOpacity onPress={() => console.log('Chat/Contato')}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={mainStyles.scrollContent}>
        <View style={[GlobalStyles.card, { paddingHorizontal: 0, paddingVertical: 5 }]}>
          {carrinho.map(item => (
            <ItemCarrinho key={item.id} item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
          ))}
        </View>

        <CalculoFrete cep={cep} setCep={setCep} endereco={endereco} setEndereco={setEndereco} onCalculate={handleCalculateFrete} subtotal={subtotal} />

        <ResumoPedido subtotal={subtotal} frete={frete} total={total} onFinish={() => console.log('Finalizar Compra')} onContinue={() => navigation.navigate("PaginaInicial")} />
      </ScrollView>

      {/* Bottom Navigation Igual à Página de Brincos */}
      <View style={mainStyles.bottomNav}>
        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons
            name="home-outline"
            size={28}
            color={COLORS.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons
            name="search-outline"
            size={28}
            color={COLORS.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons
            name="heart-outline"
            size={28}
            color={COLORS.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons
            name="cart"
            size={28}
            color={COLORS.primary} // Ícone ativo roxo
          />
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
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

// --- ESTILOS ---
const mainStyles = StyleSheet.create({
  scrollContent: { paddingVertical: 15 },
  header: { 
    height: 60, 
    paddingHorizontal: 15, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoContainer: { flexDirection: "column" },
  logoBox: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 2 },
  logoText: { fontWeight: "600", fontSize: 16, color: "#fff" },
  subtitle: { fontSize: 12, color: COLORS.secondary },
  bottomNav: { 
    height: 60, 
    borderTopWidth: 1, 
    borderTopColor: "#ddd", 
    backgroundColor: "#fff", 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center", 
    paddingBottom: 5,
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { flex: 1, alignItems: "center" },
});

// --- Global Styles ---
const GlobalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  card: { backgroundColor: COLORS.background, borderRadius: 8, marginHorizontal: 15, marginBottom: 15, padding: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  headerText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  textPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.price },
  textRegular: { fontSize: 14, color: COLORS.price },
  textSmall: { fontSize: 12, color: COLORS.secondary },
});

// --- Estilos dos Itens, Frete e Resumo ---
const itemStyles = StyleSheet.create({
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  productImage: { width: 60, height: 60, borderRadius: 4, marginRight: 10 },
  detailsContainer: { flex: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  productName: { fontSize: 14, fontWeight: '600', color: COLORS.price },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  qtyButtonText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, lineHeight: 18 },
  qtyText: { fontSize: 14, color: COLORS.price, width: 20, textAlign: 'center' },
});

const freteStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  inputGroup: { marginBottom: 15 },
  cepInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  inputCep: { flex: 1, height: 40, borderColor: COLORS.border, borderWidth: 1, borderRadius: 4, paddingHorizontal: 10, marginRight: 10 },
  calculateButton: { backgroundColor: COLORS.primary, paddingHorizontal: 15, height: 40, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  calculateButtonText: { color: COLORS.background, fontWeight: 'bold' },
  inputFull: { height: 40, borderColor: COLORS.border, borderWidth: 1, borderRadius: 4, paddingHorizontal: 10, marginTop: 5 },
  freteVantagens: { backgroundColor: COLORS.lightGray, padding: 10, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border },
});

const resumoStyles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  freteGratisText: { fontSize: 14, color: COLORS.success, fontWeight: 'bold' },
  separator: { borderBottomColor: COLORS.border, borderBottomWidth: 1, marginVertical: 10 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: COLORS.price },
  finishButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 4, alignItems: 'center', marginTop: 15 },
  finishButtonText: { color: COLORS.background, fontWeight: 'bold', fontSize: 16 },
  continueButton: { marginTop: 10, alignItems: 'center' },
  continueButtonText: { fontSize: 14, color: COLORS.primary },
});

export default CarrinhoScreen;