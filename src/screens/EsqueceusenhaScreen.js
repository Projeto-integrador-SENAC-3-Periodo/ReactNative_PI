import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { recuperarSenha } from '../services/authService';

export default function EsqueceusenhaScreen({ navigation }) {
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);

  async function enviarRecuperacao() {
    if (!identificador.trim()) {
      Alert.alert('Atenção', 'Digite seu email ou matrícula.');
      return;
    }

    setLoading(true);
    try {
      await recuperarSenha(identificador.trim());

      Alert.alert(
        'Verifique seu email',
        'Se existir uma conta com esse email ou matrícula, uma nova senha provisória foi enviada.\n\nVerifique sua caixa de entrada (e a pasta de spam) por um email do Sistema Senac.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      // Mesmo em erro de rede mostramos a mensagem genérica
      // para não revelar informações sobre cadastros
      Alert.alert(
        'Verifique seu email',
        'Se existir uma conta com esse email ou matrícula, uma nova senha provisória foi enviada.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Recuperar Senha</Text>

        <Text style={styles.subtitle}>
          Informe seu e-mail ou matrícula. Uma nova senha provisória será
          enviada para o email cadastrado.
        </Text>

        <Text style={styles.label}>EMAIL OU MATRÍCULA</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite aqui"
          placeholderTextColor="#999"
          value={identificador}
          onChangeText={setIdentificador}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={enviarRecuperacao}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENVIAR NOVA SENHA</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F2557',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#E8EEF7',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F97316',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  back: {
    marginTop: 15,
    textAlign: 'center',
    color: '#2563EB',
    fontSize: 14,
  },
});
