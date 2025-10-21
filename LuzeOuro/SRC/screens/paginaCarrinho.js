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
// 1. IMPORTANDO ÍCONES USADOS NA PÁGINA DE RELÓGIOS E NO CARRINHO
import Icon from 'react-native-vector-icons/Feather'; // Mantido para os ícones internos (trash, truck)
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones da navbar e header (chat)
import { SafeAreaView } from 'react-native-safe-area-context'; 

// --- 1. CONFIGURAÇÕES DE ESTILO (GLOBAL STYLES) ---

const COLORS = {
  primary: '#7a4f9e', // Roxo principal usado na página de relógios
  secondary: '#333', // Cor do subtítulo e texto principal da navbar (ajustado para o novo esquema)
  background: '#FFFFFF',
  lightGray: '#F5F5F5', 
  border: '#E0E0E0',
  success: '#388E3C', 
  price: '#333333',
};

// ... Estilos Globais, Dados de Exemplo, e Componentes (ItemCarrinho, CalculoFrete, ResumoPedido)
// (Mantidos como estavam, mas omitidos aqui por brevidade)

// --- COMPONENTES REPLICADOS (Funções internas) ---
// ... (Mantenha o código de ItemCarrinho, CalculoFrete e ResumoPedido aqui)

const ItemCarrinho = ({ item, onUpdateQuantity, onRemove }) => {
    // ... CÓDIGO DO ItemCarrinho INALTERADO ...
  return (
    <View style={itemStyles.itemContainer}>
      {/* Imagem do Produto */}
      <Image source={{ uri: item.imageUrl }} style={itemStyles.productImage} />

      {/* Detalhes e Ações */}
      <View style={itemStyles.detailsContainer}>
        <View style={itemStyles.infoRow}>
          <View>
            <Text style={itemStyles.productName}>{item.nome}</Text>
            <Text style={GlobalStyles.textSmall}>{item.metal}</Text>
          </View>
          {/* Ícone de Lixeira */}
          <TouchableOpacity onPress={() => onRemove(item.id)}> 
            <Icon name="trash-2" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Quantidade e Preço */}
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

const CalculoFrete = ({ cep, setCep, endereco, setEndereco, onCalculate }) => {
    // ... CÓDIGO DO CalculoFrete INALTERADO ...
    return (
        <View style={GlobalStyles.card}>
          <View style={freteStyles.header}>
            <Icon name="truck" size={20} color={COLORS.primary} style={{ marginRight: 5 }} />
            <Text style={GlobalStyles.headerText}>Calcular Frete</Text>
          </View>
          
          {/* Input CEP */}
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
    
          {/* Input Endereço Completo */}
          <View style={freteStyles.inputGroup}>
            <Text style={GlobalStyles.textRegular}>Endereço Completo</Text>
            <TextInput
              style={freteStyles.inputFull}
              placeholder="Rua, número, bairro, cidade"
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>
    
          {/* Vantagens do Frete */}
          <View style={freteStyles.freteVantagens}>
            <Text style={{...GlobalStyles.textRegular, fontWeight: 'bold'}}>Vantagens do Frete</Text>
            <Text style={GlobalStyles.textSmall}>• Frete grátis PAC para compras acima de R$ 399,90</Text>
            <Text style={GlobalStyles.textSmall}>• Frete grátis SEDEX para compras acima de R$ 990,00</Text>
          </View>
        </View>
      );
};

const ResumoPedido = ({ subtotal, frete, total, onFinish, onContinue }) => {
    // ... CÓDIGO DO ResumoPedido INALTERADO ...
    const freteGratis = frete === 'Grátis';

    return (
      <View style={[GlobalStyles.card, {marginBottom: 100}]}>
        <Text style={GlobalStyles.headerText}>Resumo do Pedido</Text>
  
        {/* Subtotal */}
        <View style={resumoStyles.summaryRow}>
          <Text style={GlobalStyles.textRegular}>Subtotal</Text>
          <Text style={GlobalStyles.textRegular}>R${subtotal.toFixed(2).replace('.', ',')}</Text>
        </View>
  
        {/* Frete */}
        <View style={resumoStyles.summaryRow}>
          <Text style={GlobalStyles.textRegular}>Frete</Text>
          <Text style={freteGratis ? resumoStyles.freteGratisText : GlobalStyles.textRegular}>
            {freteGratis ? frete : `R$ ${frete.toFixed(2).replace('.', ',')}`}
          </Text>
        </View>
  
        {/* Separador */}
        <View style={resumoStyles.separator} />
  
        {/* TOTAL */}
        <View style={resumoStyles.summaryRow}>
          <Text style={resumoStyles.totalText}>TOTAL</Text>
          <Text style={resumoStyles.totalText}>R${total.toFixed(2).replace('.', ',')}</Text>
        </View>
  
        {/* Botão Finalizar Compra */}
        <TouchableOpacity 
          style={resumoStyles.finishButton}
          onPress={onFinish}
        >
          <Text style={resumoStyles.finishButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
        
        {/* Continuar Comprando */}
        <TouchableOpacity
          onPress={onContinue}
          style={resumoStyles.continueButton}
        >
          <Text style={resumoStyles.continueButtonText}>Continuar Comprando</Text>
        </TouchableOpacity>
      </View>
    );
};


// --- 4. TELA PRINCIPAL (CarrinhoScreen) ---

// Adicionado a prop 'navigation' para navegação na navbar
const CarrinhoScreen = ({ navigation }) => { 
  const [carrinho, setCarrinho] = useState(DADOS_CARRINHO_INICIAL);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [frete, setFrete] = useState('Grátis'); 

  // Lógica de cálculo (simples)
  const subtotal = carrinho.reduce((sum, item) => sum + item.precoTotal, 0);
  const total = subtotal + (frete === 'Grátis' ? 0 : frete);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCarrinho(prevCarrinho => 
      prevCarrinho.map(item => 
        item.id === id 
          ? { ...item, 
              quantidade: newQuantity, 
              precoTotal: newQuantity * item.precoUnitario 
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCarrinho(prevCarrinho => prevCarrinho.filter(item => item.id !== id));
  };

  const handleCalculateFrete = () => {
    // Lógica real de cálculo de frete iria aqui.
    if (subtotal > 399.90) {
      setFrete('Grátis');
    } else {
      setFrete(25.50); 
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      
      {/* 🟢 HEADER ATUALIZADO (Copiado da página de Relógios) */}
      <View style={mainStyles.header}>
        <View style={mainStyles.logoContainer}>
          <View style={mainStyles.logoBox}>
            <Text style={mainStyles.logoText}>Luz e Ouro</Text>
          </View>
          <Text style={mainStyles.subtitle}>Joias e Acessórios</Text>
        </View>
        <TouchableOpacity onPress={() => console.log('Chat/Contato')}>
            {/* Ícone de chat da página de relógios */}
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={mainStyles.scrollContent}>
        
        {/* Lista de Itens do Carrinho */}
        <View style={[GlobalStyles.card, { paddingHorizontal: 0, paddingVertical: 5 }]}>
          {carrinho.map(item => (
            <ItemCarrinho 
              key={item.id} 
              item={item} 
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </View>

        {/* Cálculo de Frete */}
        <CalculoFrete 
          cep={cep}
          setCep={setCep}
          endereco={endereco}
          setEndereco={setEndereco}
          onCalculate={handleCalculateFrete}
        />
        
        {/* Resumo do Pedido */}
        <ResumoPedido 
          subtotal={subtotal} 
          frete={frete} 
          total={total} 
          onFinish={() => console.log('Finalizar Compra')}
          onContinue={() => navigation.navigate("PaginaInicial")} // Exemplo de navegação
        />
        
      </ScrollView>

      {/* 🟢 BOTTOM NAVIGATION ATUALIZADA (Copiada da página de Relógios) */}
      <View style={mainStyles.bottomNav}>
        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaInicial")}>
          <MaterialCommunityIcons name="home" size={28} color={COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaFiltros")}>
          <Ionicons name="search-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaFavoritos")}>
          <Ionicons name="heart-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>

        {/* Marcando a página atual (Carrinho) com a cor principal */}
        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaCarrinho")}>
          <Ionicons name="cart" size={28} color={COLORS.primary} /> 
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.navItem} onPress={() => navigation.navigate("PaginaPerfil")}>
          <Ionicons name="person-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- 5. ESTILOS ESPECÍFICOS (Reunidos no final) ---

const mainStyles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 15,
  },
  // 🟢 Estilos do Header COPIADOS
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
  logoBox: { 
    backgroundColor: COLORS.primary, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginBottom: 2 
  },
  logoText: { fontWeight: "600", fontSize: 16, color: "#fff" },
  subtitle: { fontSize: 12, color: COLORS.secondary }, // Usando COLORS.secondary
  
  // 🟢 Estilos da Bottom Nav COPIADOS
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

// ... Estilos itemStyles, freteStyles e resumoStyles INALTERADOS ...
const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
      },
      card: {
        backgroundColor: COLORS.background,
        borderRadius: 8,
        marginHorizontal: 15,
        marginBottom: 15,
        padding: 15,
        elevation: 2, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
      },
      // Estilos de texto
      textPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.price,
      },
      textRegular: {
        fontSize: 14,
        color: COLORS.price,
      },
      textSmall: {
        fontSize: 12,
        color: COLORS.secondary,
      },
});

const DADOS_CARRINHO_INICIAL = [
    { 
      id: '1', 
      nome: 'Conjunto Colares', 
      metal: 'Prata', 
      quantidade: 1, 
      precoUnitario: 548.90, 
      precoTotal: 548.90, 
      imageUrl: 'https://via.placeholder.com/60x60/f0e4ff/884dd9?text=C1' 
    },
    { 
      id: '2', 
      nome: 'Anel com Turmalina', 
      metal: 'Prata', 
      quantidade: 1, 
      precoUnitario: 1090.90, 
      precoTotal: 1090.90, 
      imageUrl: 'https://via.placeholder.com/60x60/e4fff0/4d88d9?text=A1' 
    },
  ];

const itemStyles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 15, 
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: 4,
      marginRight: 10,
    },
    detailsContainer: {
      flex: 1,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 5,
    },
    productName: {
      ...GlobalStyles.textRegular,
      fontWeight: '600',
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    qtyButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    qtyButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.primary,
      lineHeight: 18, 
    },
    qtyText: {
      ...GlobalStyles.textRegular,
      width: 20, 
      textAlign: 'center',
    },
  });
  
  const freteStyles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    inputGroup: {
      marginBottom: 15,
    },
    cepInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    inputCep: {
      flex: 1,
      height: 40,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
      marginRight: 10,
    },
    calculateButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 15,
      height: 40,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    calculateButtonText: {
      color: COLORS.background,
      fontWeight: 'bold',
    },
    inputFull: {
      height: 40,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
      marginTop: 5,
    },
    freteVantagens: {
      backgroundColor: COLORS.lightGray,
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
  });
  
  const resumoStyles = StyleSheet.create({
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    freteGratisText: {
      ...GlobalStyles.textRegular,
      color: COLORS.success,
      fontWeight: 'bold',
    },
    separator: {
      borderBottomColor: COLORS.border,
      borderBottomWidth: 1,
      marginVertical: 10,
    },
    totalText: {
      ...GlobalStyles.textPrice,
      fontSize: 18,
    },
    finishButton: {
      backgroundColor: COLORS.primary,
      padding: 15,
      borderRadius: 4,
      alignItems: 'center',
      marginTop: 15,
    },
    finishButtonText: {
      color: COLORS.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
    continueButton: {
      marginTop: 10,
      alignItems: 'center',
    },
    continueButtonText: {
      ...GlobalStyles.textRegular,
      color: COLORS.primary,
    }
  });


export default CarrinhoScreen;