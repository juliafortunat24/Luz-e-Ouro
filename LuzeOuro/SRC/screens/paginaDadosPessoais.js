import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#7a4f9e',
  secondary: '#333',
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  border: '#E0E0E0',
};

const PerfilUsuario = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('Júlia Fortunato');
  const [email, setEmail] = useState('juliafortunato24@gmail.com');
  const [senha, setSenha] = useState('**********');

  const handleConfirmar = () => {
    alert('Dados confirmados!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER (igual ao da Página de Carrinho) */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/35/8a2be2/ffffff?text=L' }}
            style={styles.logoImage}
          />
          <View>
            <Text style={styles.logoText}>Luz e Ouro</Text>
            <Text style={styles.logoSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => console.log('Chat/Contato')}>
          <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card de edição de perfil */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JF</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmar}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation (igual à da Página de Brincos) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PaginaInicial')}>
          <MaterialCommunityIcons name="home-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PaginaFiltros')}>
          <Ionicons name="search-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PaginaFavoritos')}>
          <Ionicons name="heart-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PaginaCarrinho')}>
          <Ionicons name="cart-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PaginaPerfil')}>
          <Ionicons name="person" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 80,
    alignItems: 'center',
  },

  // HEADER igual ao da Página de Carrinho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 45,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: COLORS.primary,
  },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logoSubtitle: { fontSize: 12, color: '#666', marginTop: -3 },

  // CARD DE PERFIL
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarText: { fontSize: 30, fontWeight: 'bold', color: '#fff' },
  formGroup: { width: '100%', marginBottom: 15 },
  label: { fontSize: 14, color: '#333', marginBottom: 5 },
  input: {
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // BOTTOM NAV (igual à página de brincos)
  bottomNav: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { flex: 1, alignItems: 'center' },
});

export default PerfilUsuario;