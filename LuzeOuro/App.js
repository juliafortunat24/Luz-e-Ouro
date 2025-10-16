import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './SRC/supabaseClient';
import Login from './SRC/screens/login';
import Cadastro from './SRC/screens/cadastro';
import PaginaInicial from './SRC/screens/paginaInicial';
import PaginaRelogios from './SRC/screens/paginaRelogios';
import PaginaAneis from './SRC/screens/paginaAneis';
import PaginaColares from './SRC/screens/paginaColares';
import PaginaBrincos from './SRC/screens/paginaBrincos';

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
          <Stack.Screen name="PaginaBrincos" component={PaginaBrincos} />
          <Stack.Screen name="PaginaColares" component={PaginaColares} />
          <Stack.Screen name="PaginaAneis" component={PaginaAneis} />
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
