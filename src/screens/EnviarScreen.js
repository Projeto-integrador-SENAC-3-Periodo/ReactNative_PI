import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export default function EnviarAtividade() {
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horas, setHoras] = useState("");
  const [arquivo, setArquivo] = useState(null);

  // 📁 Galeria / arquivos
  async function selecionarArquivo() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (!resultado.canceled) {
        setArquivo(resultado.assets[0]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  }

  // 📷 Tirar foto
  async function tirarFoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permissão negada", "Permita o uso da câmera.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setArquivo(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir a câmera.");
    }
  }

  function enviarAtividade() {
    Alert.alert("Sucesso", "Atividade enviada com sucesso!");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          ENVIAR ATIVIDADE
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>
          Comprovante / Certificado
        </Text>

        {/* BOTÃO GALERIA */}
        <TouchableOpacity
          style={styles.fileButton}
          onPress={selecionarArquivo}
        >
          <Text style={styles.fileButtonText}>
            Escolher da Galeria / Arquivo
          </Text>
        </TouchableOpacity>

        {/* BOTÃO CÂMERA */}
        <TouchableOpacity
          style={[styles.fileButton, { marginTop: 10, backgroundColor: "#D1E8FF" }]}
          onPress={tirarFoto}
        >
          <Text style={styles.fileButtonText}>
            Tirar Foto
          </Text>
        </TouchableOpacity>

        {arquivo && (
          <Text style={styles.fileName}>
            Arquivo: {arquivo.name || "Foto selecionada"}
          </Text>
        )}

        <Text style={styles.label}>Categoria</Text>

        <TextInput
          style={styles.input}
          placeholder="Selecione a categoria"
          value={categoria}
          onChangeText={setCategoria}
        />

        <Text style={styles.label}>Tipo de Atividade</Text>

        <TextInput
          style={styles.input}
          placeholder="Selecione o tipo"
          value={tipo}
          onChangeText={setTipo}
        />

        <Text style={styles.label}>Descrição</Text>

        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Descreva sua atividade"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Quantidade de Horas</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 20"
          value={horas}
          onChangeText={setHoras}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={enviarAtividade}
        >
          <Text style={styles.submitButtonText}>
            ENVIAR ATIVIDADE
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    backgroundColor: "#0F2557",
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: "#F97316",
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  formCard: {
    backgroundColor: "#FFF",
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
    color: "#0F2557",
  },

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },

  textArea: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
  },

  fileButton: {
    backgroundColor: "#E5E7EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  fileButtonText: {
    color: "#0F2557",
    fontWeight: "600",
  },

  fileName: {
    marginTop: 10,
    color: "#6B7280",
  },

  submitButton: {
    backgroundColor: "#F97316",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});