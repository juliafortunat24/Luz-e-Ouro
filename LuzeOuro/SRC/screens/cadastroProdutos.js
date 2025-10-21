import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseClient";

export default function CadastrarProdutos({ navigation }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [material, setMaterial] = useState("");
  const [tipo, setTipo] = useState("");
  const [imagem, setImagem] = useState(null);

  // Escolher imagem da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão necessária para acessar fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  // Cadastro do produto
 const cadastrarProduto = async () => {
  if (!nome || !preco || !material || !tipo || !imagem) {
    Alert.alert("Erro", "Preencha todos os campos!");
    return;
  }

  try {
    // Criar um nome único para a imagem
    const filename = `produto_${Date.now()}.jpg`;

    // Converter a imagem para blob
    const response = await fetch(imagem);
    const blob = await response.blob();

    // Upload da imagem no Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("produtos")
      .upload(filename, blob, { upsert: true });

    if (uploadError) {
      console.log("Erro no upload da imagem:", uploadError);
      Alert.alert("Erro", "Falha ao enviar a imagem.");
      return;
    }

    console.log("Upload realizado com sucesso:", uploadData);

    // Obter URL pública da imagem
    const { data: urlData, error: urlError } = supabase.storage
      .from("produtos")
      .getPublicUrl(uploadData.path);

    if (urlError) {
      console.log("Erro ao obter URL pública:", urlError);
      Alert.alert("Erro", "Não foi possível gerar a URL da imagem.");
      return;
    }

    const publicUrl = urlData.publicUrl;
    console.log("URL pública da imagem:", publicUrl);

    // Inserir produto na tabela
    const { data, error } = await supabase
      .from("produtos")
      .insert([{ nome, preco: parseFloat(preco), material, tipo, foto_url: publicUrl }]);

    if (error) {
      console.log("Erro ao inserir produto:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
      return;
    }

    Alert.alert("Sucesso", "Produto cadastrado!");
    setNome(""); setPreco(""); setMaterial(""); setTipo(""); setImagem(null);

  } catch (err) {
    console.log("Erro inesperado:", err);
    Alert.alert("Erro", "Ocorreu um erro inesperado.");
  }
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Cadastrar Produto</Text>

      <TextInput style={styles.input} placeholder="Nome do Produto" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Material" value={material} onChangeText={setMaterial} />
      <TextInput style={styles.input} placeholder="Tipo" value={tipo} onChangeText={setTipo} />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.button} onPress={cadastrarProduto}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#7a4f9e", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { backgroundColor: "#7a4f9e", padding: 15, borderRadius: 8, marginBottom: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  previewImage: { width: "100%", height: 200, marginBottom: 15, borderRadius: 8 },
});