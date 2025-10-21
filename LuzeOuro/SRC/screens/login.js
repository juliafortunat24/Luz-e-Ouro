import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../supabaseClient';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

 const handleLogin = async () => {
  setError(null);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    // login OK
    if (data.user && email.toLowerCase() === 'admin@admin.com') {
      navigation.navigate('PaginaAdmin'); // admin
    } else {
      navigation.navigate('PaginaInicial'); // usuários comuns
    }
  } catch (err) {
    setError("Erro inesperado: " + err.message);
  }
};



  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Luz e Ouro</Text>

      {/* Caixa arredondada fixa embaixo */}
      <View style={styles.formBox}>
        {/* Logo do colar */}
        <Image
          source={require('../../assets/colar roxo fundo.png')} // coloque sua imagem aqui
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Campo Email */}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Campo Senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Erro */}
        {error && <Text style={styles.error}>{error}</Text>}

        {/* Botão Entrar */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Link Cadastro */}
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.registerText}>
            Não tem uma conta? <Text style={styles.registerLink}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    alignItems:'center',
  },
  title:{
    fontSize:26,
    fontWeight:'500',
    color:'#80608a',
    marginTop:200, // deixa o título mais pra cima
    marginBottom:0,
  },
  formBox:{
    position:'absolute', // fixa no fundo
    bottom:0,
    width:'100%',
    backgroundColor:'#d9d6d6',
    borderTopLeftRadius:200,
    borderTopRightRadius:200,
    padding:85,
    alignItems:'center'
  },
  logo:{
    width:500,
    height:130,
    marginBottom:20
  },
  label:{
    alignSelf:'flex-start',
    marginLeft:20,
    marginBottom:5,
    fontSize:14,
    color:'#333'
  },
  input:{
    width:'100%',
    borderWidth:1,
    borderColor:'#80608a',
    marginBottom:15,
    padding:10,
    borderRadius:8,
    backgroundColor:'#f5f5ff'
  },
  button:{
    backgroundColor:'#80608a',
    paddingVertical:12,
    paddingHorizontal:40,
    borderRadius:8,
    marginTop:10
  },
  buttonText:{
    color:'#fff',
    fontSize:16,
    fontWeight:'bold'
  },
  error:{
    color:'red',
    marginBottom:10,
    textAlign:'center'
  },
  registerText:{
    marginTop:15,
    fontSize:14,
    color:'#333'
  },
  registerLink:{
    color:'#80608a',
    fontWeight:'500'
  }
});