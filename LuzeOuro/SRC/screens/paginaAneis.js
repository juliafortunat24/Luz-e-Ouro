import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
// Ícones: Certifique-se de que estão instalados: expo install @expo/vector-icons
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'; 

const screenWidth = Dimensions.get('window').width;

// --- DADOS MOCKADOS PARA PRODUTOS E FILTROS ---
const products = [
    { id: 1, type: 'Ouro', title: 'Colar de ouro Elegante', price: '309,90', image: 'https://via.placeholder.com/150/f0e68c/000000?text=Colar+Ouro+1' },
    { id: 2, type: 'Ouro', title: 'Colar com pingente', price: '320,90', image: 'https://via.placeholder.com/150/ffd700/000000?text=Colar+Ouro+2' },
    { id: 3, type: 'Prata', title: 'Anel Cravejado', price: '540,90', image: 'https://via.placeholder.com/150/e0e0e0/000000?text=Anel+Prata+1' },
    { id: 4, type: 'Prata', title: 'Anel com Turmalina', price: '1.090,90', image: 'https://via.placeholder.com/150/ADD8E6/000000?text=Anel+Prata+2' },
    { id: 5, type: 'Ouro', title: 'Brinco Brilhante', price: '200,90', image: 'https://via.placeholder.com/150/F0E68C/000000?text=Brinco+Ouro' },
    { id: 6, type: 'Prata', title: 'Conjunto Colares', price: '540,90', image: 'https://via.placeholder.com/150/D3D3D3/000000?text=Colar+Prata+3' },
    { id: 7, type: 'Prata', title: 'Colar Brilhante', price: '90,00', image: 'https://via.placeholder.com/150/E6E6FA/000000?text=Colar+Prata+4' },
    { id: 8, type: 'Ouro', title: 'Colar Flor Branca', price: '200,90', image: 'https://via.placeholder.com/150/FAFAD2/000000?text=Colar+Ouro+3' },
];

const filterOptions = {
    tipos: ['Todos os tipos', 'Colares', 'Anéis', 'Pulseiras', 'Brincos', 'Relógios'],
    materiais: ['Todos os materiais', 'Ouro', 'Prata', 'Ouro Branco'],
    precos: ['Todos os preços', 'Até R$500 reais', 'R$500 a R$1.000', 'R$1.000 a R$1.500', 'Acima de R$1.500'],
};
// ---------------------------------------------


// --- COMPONENTES ---

// 1. Componente de Item do Produto (Card)
const ProductCard = ({ product }) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      {/* Ícone de Coração - Fiel à imagem */}
      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons name="heart-outline" size={24} color="#fff" style={{textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}} />
      </TouchableOpacity>
      {/* Ícone de Mais - Fiel à imagem */}
      <TouchableOpacity style={styles.plusIcon}>
        <Ionicons name="add-circle" size={30} color="#8a2be2" />
      </TouchableOpacity>
    </View>
    
    <View style={styles.cardDetails}>
      <Text style={styles.productType}>{product.type}</Text>
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productPrice}>R$ {product.price}</Text>
    </View>
  </View>
);

// 2. Componente de Cabeçalho (Header) - Fiel à imagem
const Header = () => (
  <View style={styles.header}>
    <View style={styles.logoContainer}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/30/8a2be2/ffffff?text=L' }} // Substitua pelo seu logo
        style={styles.logoImage} 
      />
      <View>
        <Text style={styles.logoText}>Luz e Ouro</Text>
        <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
      </View>
    </View>
    <TouchableOpacity>
      <Ionicons name="chatbubble-outline" size={24} color="#666" />
    </TouchableOpacity>
  </View>
);

// 3. Componente da Barra de Navegação Inferior (Footer Nav) - Fiel à imagem
const FooterNav = () => (
    <View style={styles.footerNav}>
        <Ionicons name="home-outline" size={28} color="#9370DB" /> {/* Cor mais escura para o ativo */}
        <Ionicons name="search-outline" size={28} color="#666" />
        <Ionicons name="heart-outline" size={28} color="#666" />
        <Ionicons name="cart-outline" size={28} color="#666" />
        <Ionicons name="person-outline" size={28} color="#666" />
    </View>
);


// 4. Componente Principal da Tela
export default function CatalogScreen() {
    // Estado para controlar qual dropdown está aberto
    const [openDropdown, setOpenDropdown] = useState(null); // 'tipos', 'materiais', 'precos'

    // Função para renderizar o Dropdown
    const renderDropdown = (key) => (
        <View style={styles.dropdownMenu}>
            {filterOptions[key].map((option, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.dropdownItem}
                    onPress={() => {
                        console.log('Filtro selecionado:', option);
                        setOpenDropdown(null); // Fecha o dropdown após a seleção
                    }}
                >
                    <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    // Função para renderizar o item de filtro (botão)
    const renderFilterItem = (key, placeholder) => (
        <View style={styles.filterItemWrapper}>
            <TouchableOpacity 
                style={[styles.filterDropdownButton, openDropdown === key && styles.filterDropdownButtonActive]}
                onPress={() => setOpenDropdown(openDropdown === key ? null : key)}
            >
                <Text style={styles.filterButtonText}>{placeholder}</Text>
                <Ionicons 
                    name={openDropdown === key ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                />
            </TouchableOpacity>
            
            {/* Renderiza o menu se o estado corresponder */}
            {openDropdown === key && renderDropdown(key)}
        </View>
    );

  return (
    <View style={styles.screenContainer}>
        <Header />
        
        {/* Barra de Busca - Fiel à imagem */}
        <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#999"
            />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>

            {/* Container de Filtros - Fiel à imagem */}
            <View style={styles.filtersBox}>
                <View style={styles.filtersHeader}>
                    <Feather name="filter" size={18} color="#333" />
                    <Text style={styles.filtersTitle}>Filtros</Text>
                </View>

                {/* Filtro 1: Tipos */}
                {renderFilterItem('tipos', 'Todos os tipos')}
                {/* Filtro 2: Materiais */}
                {renderFilterItem('materiais', 'Todos os materiais')}
                {/* Filtro 3: Preços */}
                {renderFilterItem('precos', 'Todos os preços')}
                
            </View>


            {/* Lista de Produtos (simulando 2 colunas) */}
            <View style={styles.productsGrid}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </View>

            <View style={{height: 50}}/> {/* Espaçamento para a barra inferior */}

        </ScrollView>
        <FooterNav />
    </View>
  );
}

// --- ESTILOS (StyleSheet) ---
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        paddingBottom: 80, // Espaço para o FooterNav
    },

    // --- Header Styles (Fidelidade alta) ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingTop: 45, // Ajuste para a StatusBar
        backgroundColor: '#fff',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 35,
        height: 35,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: '#8a2be2', 
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: -3,
    },
    
    // --- Search Bar Styles (Fidelidade alta) ---
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginHorizontal: 15,
        marginVertical: 15,
        height: 45,
    },
    searchIcon: {
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },

    // --- Filters Box Styles (Fidelidade alta) ---
    filtersBox: {
        backgroundColor: '#f5f5f5',
        marginHorizontal: 15,
        borderRadius: 10,
        padding: 15,
    },
    filtersHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    filtersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#333',
    },
    filterItemWrapper: {
        position: 'relative', // Para posicionar o dropdown sobre o conteúdo
        marginBottom: 10,
    },
    filterDropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0', // Borda sutil
    },
    filterDropdownButtonActive: {
        borderColor: '#9370DB', // Borda mais forte quando ativo
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    filterButtonText: {
        fontSize: 15,
        color: '#333',
    },
    
    // --- Dropdown Menu Styles (Fidelidade alta) ---
    dropdownMenu: {
        position: 'absolute',
        top: '100%', // Posiciona logo abaixo do botão
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderWidth: 1,
        borderColor: '#9370DB',
        borderTopWidth: 0,
        zIndex: 10,
        // Sombra leve para destacar
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdownItem: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#333',
    },

    // --- Grid and Card Styles (Fidelidade alta) ---
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 20,
    },
    cardContainer: {
        width: screenWidth / 2 - 22, // 2 itens com margem entre eles
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: screenWidth / 2 - 22, // Mantém a proporção quadrada
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 5,
        // Fundo do coração na imagem é transparente
    },
    plusIcon: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        padding: 2,
        backgroundColor: 'transparent',
    },
    cardDetails: {
        padding: 10,
        minHeight: 80, 
    },
    productType: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8a2be2',
    },

    // --- Footer Navigation Styles (Fidelidade alta) ---
    footerNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
        position: 'absolute', 
        bottom: 0,
        width: '100%',
        height: 55,
    },
});