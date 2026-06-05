import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

export default function EsqueceusenhaScreen({ navigation }) {
  const [email, setEmail] = useState("");

  function enviarRecuperacao() {
    if (!email) {
      Alert.alert("Erro", "Digite seu email ou matrícula.");
      return;
    }

    Alert.alert(
      "Sucesso",
      "Se existir uma conta, enviaremos instruções para recuperação."
    );

    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>

        <Text style={styles.title}>
          Recuperar Senha
        </Text>

        <Text style={styles.subtitle}>
          Informe seu e-mail ou matrícula para recuperar o acesso.
        </Text>

        <Text style={styles.label}>EMAIL OU MATRÍCULA</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite aqui"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={enviarRecuperacao}
        >
          <Text style={styles.buttonText}>
            ENVIAR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>
            Voltar para o login
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F2557",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#E8EEF7",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#F97316",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  back: {
    marginTop: 15,
    textAlign: "center",
    color: "#2563EB",
    fontSize: 14,
  },
});