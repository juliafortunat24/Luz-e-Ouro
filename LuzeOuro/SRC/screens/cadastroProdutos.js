import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseClient";

// ⭐ IMPORTANDO O TEMA
import { useTheme } from "./ThemeContext";

export default function CadastrarProdutos({ navigation }) {
  const { colors, isDark } = useTheme(); // ⭐ ACESSA O TEMA GLOBAL

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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* VOLTAR */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primary }]}>Cadastrar Produto</Text>

      <TextInput
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: isDark ? "#444" : "#ccc",
        }]}
        placeholder="Nome do Produto"
        placeholderTextColor={isDark ? "#888" : "#999"}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: isDark ? "#444" : "#ccc",
        }]}
        placeholder="Preço (R$)"
        placeholderTextColor={isDark ? "#888" : "#999"}
        value={preco}
        onChangeText={handlePrecoChange}
        keyboardType="numeric"
      />

      {/* MATERIAL */}
      <View style={styles.pickerWrapper}>
        <Text style={[styles.pickerLabel, { color: colors.text }]}>Material</Text>

        <View style={[styles.pickerContainer, { borderColor: isDark ? "#444" : "#ccc" }]}>
          {["Prata", "Ouro", "Ouro Branco"].map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, {
                backgroundColor: colors.card,
                borderRightWidth: index !== 2 ? 1 : 0,
                borderRightColor: isDark ? "#444" : "#ccc",
              }]}
              onPress={() => setMaterial(item)}
            >
              <Text
                style={material === item
                  ? [styles.selectedOption, { backgroundColor: colors.primary }]
                  : [styles.optionText, { color: colors.text }]
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* TIPO */}
      <View style={styles.pickerWrapper}>
        <Text style={[styles.pickerLabel, { color: colors.text }]}>Tipo</Text>

        <View style={[styles.pickerContainer, { borderColor: isDark ? "#444" : "#ccc" }]}>
          {["Colar", "Relogios", "Anéis", "Brincos"].map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, {
                backgroundColor: colors.card,
                borderRightWidth: index !== 3 ? 1 : 0,
                borderRightColor: isDark ? "#444" : "#ccc",
              }]}
              onPress={() => setTipo(item)}
            >
              <Text
                style={tipo === item
                  ? [styles.selectedOption, { backgroundColor: colors.primary }]
                  : [styles.optionText, { color: colors.text }]
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* BOTÃO IMAGEM */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={styles.previewImage} />}

      {/* BOTÃO CADASTRAR */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={cadastrarProduto}
      >
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 24 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  pickerWrapper: { marginBottom: 15 },
  pickerLabel: { marginBottom: 5, fontWeight: "600" },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  optionText: {},
  selectedOption: {
    color: "#fff",
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  button: { padding: 15, borderRadius: 8, marginBottom: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  previewImage: { width: "100%", height: 200, marginBottom: 15, borderRadius: 8 },
});
