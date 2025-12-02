import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { supabase } from '../supabaseClient';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const userId = data.user.id;

    await supabase
      .from('profiles')
      .upsert({ id: userId, full_name: name, email });

    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          <Text style={styles.title}>Cadastro</Text>

          <View style={styles.formBox}>
            <Image
              source={require('../../assets/colar roxo fundo.png')}
              style={styles.logo}
            />

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <Text style={styles.registerText}>
              Já tem conta?{' '}
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate('Login')}
              >
                Entrar
              </Text>
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
    color: '#80608a',
    marginTop: 150,
  },
  formBox: {
    flex: 1,
    width: '100%',
    backgroundColor: '#d9d6d6',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    padding: 85,
    paddingBottom: 120, // evita o risco branco no final
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 500,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#80608a',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5ff',
  },
  button: {
    backgroundColor: '#80608a',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerText: {
    marginTop: 15,
    fontSize: 14,
    color: '#333',
  },
  registerLink: {
    color: '#80608a',
    fontWeight: '500',
  },
});
