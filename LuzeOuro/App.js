import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './SRC/supabaseClient';
import Login from './SRC/screens/login';
import Cadastro from './SRC/screens/cadastro';
import PaginaInicial from './SRC/screens/paginaInicial';
import PaginaRelogios from './SRC/screens/paginaRelogios.js';
// import PaginaAneis from './SRC/screens/paginaAneis';
// import PaginaColares from './SRC/screens/paginaColares';
// import PaginaBrincos from './SRC/screens/paginaBrincos';
import PaginaPerfil from './SRC/screens/paginaPerfil';
import PaginaFavoritos from './SRC/screens/paginaFavoritos';
import PaginaCarrinho from './SRC/screens/paginaCarrinho';
import PaginaFiltros from './SRC/screens/paginaFiltros';
import PaginaAdmin from './SRC/screens/paginaAdmin';
import CadastroProdutos from './SRC/screens/cadastroProdutos';
import Catalogo from './SRC/screens/catalogo';
import DadosPessoais from './SRC/screens/paginaDadosPessoais.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 🔹 Sempre desloga ao carregar o app (assim força o retorno à tela de login)
    const resetSession = async () => {
      await supabase.auth.signOut();
      setSession(null);
    };

    resetSession();

    // Mesmo assim, escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (<>
          <Stack.Screen name="PaginaInicial" component={PaginaInicial} />
          <Stack.Screen name="PaginaRelogios" component={PaginaRelogios} />
          {/* <Stack.Screen name="PaginaBrincos" component={PaginaBrincos} />
          <Stack.Screen name="PaginaColares" component={PaginaColares} />
          <Stack.Screen name="PaginaAneis" component={PaginaAneis} /> */}
          <Stack.Screen name="PaginaFiltros" component={PaginaFiltros} />
          <Stack.Screen name="PaginaCarrinho" component={PaginaCarrinho} />
          <Stack.Screen name="PaginaFavoritos" component={PaginaFavoritos} />
          <Stack.Screen name="PaginaPerfil" component={PaginaPerfil} />
          <Stack.Screen name="CadastroProdutos" component={CadastroProdutos} />
          <Stack.Screen name="PaginaAdmin" component={PaginaAdmin} />
          <Stack.Screen name="Catalogo" component={Catalogo} />
          <Stack.Screen name="DadosPessoais" component={DadosPessoais} />
        </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}