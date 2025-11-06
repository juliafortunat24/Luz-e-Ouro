import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseClient";

export default function CadastrarProdutos({ navigation }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [material, setMaterial] = useState("Prata");
  const [tipo, setTipo] = useState("Colar");
  const [imagem, setImagem] = useState(null);

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

  const cadastrarProduto = async () => {
    if (!nome || !preco || !material || !tipo || !imagem) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const filename = `produto_${Date.now()}.jpg`;
      const response = await fetch(imagem);
      const blob = await response.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("produtos")
        .upload(filename, blob, { upsert: true });

      if (uploadError) {
        Alert.alert("Erro", "Falha ao enviar a imagem.");
        return;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from("produtos")
        .getPublicUrl(uploadData.path);

      if (urlError) {
        Alert.alert("Erro", "Não foi possível gerar a URL da imagem.");
        return;
      }

      const publicUrl = urlData.publicUrl;

      const { error } = await supabase
        .from("produtos")
        .insert([{ nome, preco: parseFloat(preco), material, tipo, foto_url: publicUrl }]);

      if (error) {
        Alert.alert("Erro", "Não foi possível cadastrar o produto.");
        return;
      }

      Alert.alert("Sucesso", "Produto cadastrado!");
      setNome(""); 
      setPreco(""); 
      setMaterial("Prata"); 
      setTipo("Colar"); 
      setImagem(null);

    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    }
  };

  const handlePrecoChange = (value) => {
    const numericValue = value.replace(/[^0-9.,]/g, "");
    setPreco(numericValue);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cadastrar Produto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço (R$)"
        value={preco}
        onChangeText={handlePrecoChange}
        keyboardType="numeric"
      />

      {/* Materiais */}
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Material</Text>
        <View style={styles.pickerContainer}>
          {["Prata", "Ouro", "Ouro Branco"].map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, index === 2 && { borderRightWidth: 0 }]}
              onPress={() => setMaterial(item)}
            >
              <Text style={material === item ? styles.selectedOption : styles.optionText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tipos */}
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Tipo</Text>
        <View style={styles.pickerContainer}>
          {["Colar", "Relogios", "Anéis", "Brincos"].map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, index === 3 && { borderRightWidth: 0 }]}
              onPress={() => setTipo(item)}
            >
              <Text style={tipo === item ? styles.selectedOption : styles.optionText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 24, color: "#7a4f9e" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#7a4f9e", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 },
  pickerWrapper: { marginBottom: 15 },
  pickerLabel: { marginBottom: 5, fontWeight: "600", color: "#555" },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  optionText: { color: "#555" },
  selectedOption: {
    color: "#fff",
    fontWeight: "700",
    backgroundColor: "#7a4f9e",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  button: { backgroundColor: "#7a4f9e", padding: 15, borderRadius: 8, marginBottom: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  previewImage: { width: "100%", height: 200, marginBottom: 15, borderRadius: 8 },
});
