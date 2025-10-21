import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // <-- Importado aqui

const PerfilUsuario = () => {
  const navigation = useNavigation(); // <-- Hook de navegação
  const [nome, setNome] = useState('Júlia Fortunato');
  const [email, setEmail] = useState('juliafortunato24@gmail.com');
  const [senha, setSenha] = useState('**********');

  const handleConfirmar = () => {
    alert('Dados confirmados!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Ionicons name="person-circle" size={32} color="#6a329f" />
          <View>
            <Text style={styles.headerTitle}>Luz e Ouro</Text>
            <Text style={styles.headerSubtitle}>Joias e Acessórios</Text>
          </View>
        </View>
        <Ionicons name="chatbubble-outline" size={24} color="#6a329f" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cartão de edição */}
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

      {/* Barra de Navegação Inferior */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('PaginaInicial')}>
          <Ionicons name="home-outline" size={24} color="#6a329f" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PaginaFiltros')}>
          <Ionicons name="search-outline" size={24} color="#6a329f" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PaginaFavoritos')}>
          <Ionicons name="heart-outline" size={24} color="#6a329f" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PaginaCarrinho')}>
          <Ionicons name="cart-outline" size={24} color="#6a329f" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PaginaPerfil')}>
          <Ionicons name="person" size={24} color="#6a329f" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos idênticos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLogo: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 5 },
  headerSubtitle: { fontSize: 12, color: '#666', marginLeft: 5 },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#6a329f',
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
    backgroundColor: '#6a329f',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
});

export default PerfilUsuario;
