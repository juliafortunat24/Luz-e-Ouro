import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
// Se estiver usando Expo, você pode usar os ícones abaixo.
// Se não estiver, você precisará instalar 'react-native-vector-icons'.
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 

const screenWidth = Dimensions.get('window').width;

// 1. Dados dos Produtos - Mock
const productsPage1 = [
  { id: 1, type: 'Ouro', title: 'Conjunto Relogio Ouro', price: '999,90', image: 'https://via.placeholder.com/150/f0e68c/000000?text=Relogio+Ouro' },
  { id: 2, type: 'Ouro e Prata', title: 'Conjunto Misto', price: '320,90', image: 'https://via.placeholder.com/150/d3d3d3/000000?text=Relogio+Misto' },
];

const productsPage2 = [
  { id: 3, type: 'Prata', title: 'Conjunto Prata', price: '540,90', image: 'https://via.placeholder.com/150/e0e0e0/000000?text=Relogio+Prata' },
  { id: 4, type: 'Prata', title: 'Relogio Cravejado', price: '1.090,90', image: 'https://via.placeholder.com/150/ffffff/000000?text=Relogio+Cravejado' },
];

const productsPage3 = [
    { id: 5, type: 'Ouro', title: 'Conjunto Relogio Ouro', price: '999,90', image: 'https://via.placeholder.com/150/f0e68c/000000?text=Relogio+Ouro' },
    { id: 6, type: 'Ouro e Prata', title: 'Conjunto Misto', price: '320,90', image: 'https://via.placeholder.com/150/d3d3d3/000000?text=Relogio+Misto' },
    { id: 7, type: 'Ouro', title: 'Relogio', price: '540,90', image: 'https://via.placeholder.com/150/ffd700/000000?text=Relogio+Ouro+Simples' },
    { id: 8, type: 'Prata', title: 'Anel Zircônia', price: '800,90', image: 'https://via.placeholder.com/150/e6e6fa/000000?text=Anel+Zirconia' },
];


// 2. Componente de Item do Produto (Card)
const ProductCard = ({ product }) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      {/* Botão de Coração (Favoritar) */}
      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons name="heart-outline" size={24} color="#666" />
      </TouchableOpacity>
      {/* Botão de Adicionar ao Carrinho */}
      <TouchableOpacity style={styles.plusIcon}>
        <MaterialCommunityIcons name="plus-circle" size={30} color="#8a2be2" />
      </TouchableOpacity>
    </View>
    
    <View style={styles.cardDetails}>
      <Text style={styles.productType}>{product.type}</Text>
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productPrice}>R$ {product.price}</Text>
    </View>
  </View>
);

// 3. Componente de Cabeçalho (Header)
const Header = () => (
  <View style={styles.header}>
    <View style={styles.logoContainer}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/30/8a2be2/ffffff?text=L' }} 
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

// 4. Componente de Oferta Especial (Somente na Imagem 2)
const SpecialOffer = () => (
    <View style={styles.specialOfferContainer}>
        <Text style={styles.specialOfferTitle}>Oferta Especial</Text>
        <Text style={styles.specialOfferText}>
            10% de desconto em toda a coleção de prata
        </Text>
        <TouchableOpacity style={styles.specialOfferButton}>
            <Text style={styles.specialOfferButtonText}>Ver Catalogo</Text>
        </TouchableOpacity>
    </View>
);

// 5. Componente da Barra de Navegação Inferior (Footer Nav)
const FooterNav = () => (
    <View style={styles.footerNav}>
        <Ionicons name="home-outline" size={28} color="#8a2be2" />
        <Ionicons name="search-outline" size={28} color="#666" />
        <Ionicons name="heart-outline" size={28} color="#666" />
        <Ionicons name="cart-outline" size={28} color="#666" />
        <Ionicons name="person-outline" size={28} color="#666" />
    </View>
);


// 6. Componente Principal - Simula as duas páginas
export default function App() {
    // Para simular as duas páginas, vou renderizar o conteúdo de ambas
    // em sequência, separadas por um título, para mostrar a fidelidade.
  return (
    <View style={styles.screenContainer}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>

            {/* CONTEÚDO DA IMAGEM 1: Relogios Destaque e Relogios de Prata */}
            <Text style={styles.sectionTitle}>Relogios Destaque</Text>
            <View style={styles.productsGrid}>
                {productsPage1.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </View>

            <Text style={styles.sectionTitle}>Relogios de Prata</Text>
            <View style={styles.productsGrid}>
                {productsPage2.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </View>

            {/* Separador (ou renderize apenas o conteúdo de uma página por vez em seu app) */}
            <View style={styles.separator} /> 
            

            {/* CONTEÚDO DA IMAGEM 2: Relogio de Ouro e Oferta Especial */}
            <Text style={styles.sectionTitle}>Relogio de Ouro</Text>
            <View style={styles.productsGrid}>
                {productsPage3.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </View>

            <SpecialOffer />

            <View style={{height: 50}}/> {/* Espaçamento para a barra inferior */}

        </ScrollView>
        <FooterNav />
    </View>
  );
}

// 7. Estilos (StyleSheet)
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    // --- Header Styles ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingTop: 40, // Espaço para StatusBar
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
        backgroundColor: '#8a2be2', // Cor de fundo do ícone na imagem
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    // --- Section Title Styles ---
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 15,
        marginTop: 25,
    },
    // --- Grid and Card Styles ---
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: -5, // Compensação de margem
    },
    cardContainer: {
        width: screenWidth / 2 - 20, // Calcula largura para 2 cards com margem
        marginBottom: 15,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        // Estilo de Sombra Suave (aproximação do Material Design)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: 150, // Altura da imagem
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
    },
    plusIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        padding: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
    },
    cardDetails: {
        padding: 10,
        minHeight: 80, 
    },
    productType: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
        fontWeight: '500',
    },
    productTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8a2be2', // Cor roxa (aproximação)
    },
    // --- Special Offer Styles (Imagem 2) ---
    specialOfferContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        marginVertical: 20,
    },
    specialOfferTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#333',
        marginBottom: 10,
    },
    specialOfferText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    specialOfferButton: {
        backgroundColor: '#8a2be2', // Cor roxa (aproximação)
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    specialOfferButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // --- Footer Navigation Styles ---
    footerNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        position: 'absolute', // Fica fixo no rodapé
        bottom: 0,
        width: '100%',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    }
});