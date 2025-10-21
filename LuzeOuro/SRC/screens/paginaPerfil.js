import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// IMPORT DO SUPABASE (use o seu cliente real)
import { supabase } from '../supabaseClient'; 
// OBS: Certifique-se que o caminho para o seu supabaseClient está correto.

// --- DADOS MOCKADOS (Substitua pelos dados reais do usuário do Supabase) ---
const mockUser = {
  initials: "JF",
  name: "Júlia Fortunato",
  email: "juliafortunato@gmail.com",
  memberSince: "janeiro de 2025",
  totalOrders: 12,
  totalFavorites: 3,
  recentOrders: [
    { id: "#01", date: "15/02/2025", value: "R$ 300,00", status: "Entregue" },
    { id: "#02", date: "22/06/2025", value: "R$ 550,00", status: "Entregue" },
  ],
};

// Componente para o Box de Estatísticas (Pedidos e Favoritos)
const StatBox = ({ count, label, iconName }) => (
  <View style={styles.statBox}>
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Componente para os Itens de Navegação Inferiores (Dados Pessoais, Sair)
const NavItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#555" style={{ width: 30 }} />
    <Text style={styles.navItemText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

export default function PaginaPerfil({ navigation }) {
  const [userProfile, setUserProfile] = useState(mockUser);

  // Função para fazer o Log out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Erro ao sair", error.message);
    } else {
      // Redireciona para a tela de login (ajuste o nome da tela se for diferente)
      navigation.replace('PaginaLogin'); 
    }
  };

  // Aqui você buscará os dados do usuário real do Supabase
  useEffect(() => {
    // 1. Obter o usuário logado
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Exemplo de como você pode integrar os dados do Supabase
        // Normalmente, você faria um SELECT na sua tabela de 'profiles' aqui
        setUserProfile({
          ...mockUser, // Mantém dados mockados temporariamente
          email: user.email,
          // Se você tiver um nome de usuário, busque e use aqui
        });
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header (Topo) */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>Luz e Ouro</Text>
          </View>
          <Text style={styles.subtitle}>Joias e Acessórios</Text>
        </View>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#7a4f9e" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Principal do Usuário */}
        <View style={styles.profileCard}>
          {/* Avatar com as Iniciais */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userProfile.initials}</Text>
          </View>
          
          {/* Informações */}
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <Text style={styles.userSince}>
              Cliente desde {userProfile.memberSince}
            </Text>
          </View>

          {/* Estatísticas (Pedidos e Favoritos) */}
          <View style={styles.statsRow}>
            <StatBox
              count={userProfile.totalOrders}
              label="Pedidos"
              iconName="basket-outline"
            />
            <StatBox
              count={userProfile.totalFavorites}
              label="Favoritos"
              iconName="heart-outline"
            />
          </View>
        </View>

        {/* Botoes de Acesso Rápido (Pedidos e Favoritos) */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity 
            style={styles.quickAccessButton}
            onPress={() => navigation.navigate("PaginaPedidos")} // Ajuste a navegação
          >
            <Ionicons name="gift-outline" size={24} color="#7a4f9e" />
            <Text style={styles.quickAccessText}>Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAccessButton}
            onPress={() => navigation.navigate("PaginaFavoritos")} // Ajuste a navegação
          >
            <Ionicons name="heart-outline" size={24} color="#7a4f9e" />
            <Text style={styles.quickAccessText}>Favoritos</Text>
          </TouchableOpacity>
        </View>

        {/* Pedidos Recentes */}
        <View style={styles.recentOrdersCard}>
          <Text style={styles.recentOrdersTitle}>Pedidos recentes</Text>
          
          {userProfile.recentOrders.map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View>
                <Text style={styles.orderId}>Pedido {order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.orderValue}>{order.value}</Text>
                <Text style={styles.orderStatus}>{order.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Itens de Navegação (Dados Pessoais e Sair) */}
        <View style={styles.navSection}>
          <NavItem 
            icon="person-outline" 
            text="Dados Pessoais" 
            onPress={() => navigation.navigate("DadosPessoais")} // Ajuste a navegação
          />
          <NavItem 
            icon="log-out-outline" 
            text="Sair da Conta" 
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>

      {/* Navegação Inferior (Mantida do seu componente anterior) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemBottom} onPress={() => navigation.navigate("PaginaInicial")}>
            <MaterialCommunityIcons name="home-outline" size={28} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemBottom} onPress={() => navigation.navigate("PaginaFiltros")}>
            <Ionicons name="search-outline" size={28} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemBottom} onPress={() => navigation.navigate("PaginaFavoritos")}>
            <Ionicons name="heart-outline" size={28} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemBottom} onPress={() => navigation.navigate("PaginaCarrinho")}>
            <Ionicons name="cart-outline" size={28} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemBottom} onPress={() => navigation.navigate("PaginaPerfil")}>
            {/* Ícone de perfil ATIVO */}
            <Ionicons name="person" size={28} color="#7a4f9e" /> 
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 20, // Espaçamento extra no final do ScrollView
  },
  // Estilos do Header (Replicados do seu componente anterior)
  header: {
    height: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "column",
  },
  logoBox: {
    backgroundColor: "#7a4f9e",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 2,
  },
  logoText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#333",
  },
  
  // Estilos do Card Principal
  profileCard: {
    backgroundColor: "#f5f5f5",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7a4f9e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  userSince: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  statBox: {
    alignItems: "center",
  },
  statCount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7a4f9e",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  // Estilos da Fileira de Acesso Rápido
  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  quickAccessButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: 'center',
  },
  quickAccessText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#7a4f9e",
  },

  // Estilos dos Pedidos Recentes
  recentOrdersCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2, // Sombra para Android
  },
  recentOrdersTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  orderId: {
    fontWeight: "600",
    color: "#333",
    fontSize: 15,
  },
  orderDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  orderValue: {
    fontWeight: "700",
    color: "#7a4f9e",
    fontSize: 16,
  },
  orderStatus: {
    fontSize: 12,
    color: "green", // Cor verde para "Entregue"
    marginTop: 2,
  },

  // Estilos da Seção de Navegação (Dados Pessoais e Sair)
  navSection: {
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: 'hidden', // Para que a borda seja aplicada corretamente
    borderWidth: 1,
    borderColor: '#eee',
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  navItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },

  // Estilos da Navegação Inferior (Replicados do seu componente anterior)
  bottomNav: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 5,
  },
  navItemBottom: {
    flex: 1,
    alignItems: "center",
  },
});