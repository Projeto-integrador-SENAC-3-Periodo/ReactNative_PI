import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, ActivityIndicator,
} from 'react-native';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function fazerLogin() {
    if (!identificador.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha email/matrícula e senha.');
      return;
    }
    setLoading(true);
    try {
      const response = await login(identificador.trim(), senha);

      if (response.role !== 'ALUNO') {
        Alert.alert('Acesso negado', 'Este aplicativo é exclusivo para alunos.');
        return;
      }

      // signIn atualiza o contexto → App.js troca automaticamente para as tabs
      signIn(response);

      // Avisa sobre senha provisória DEPOIS do login (a navegação já aconteceu)
      if (response.senhaProvisoria) {
        Alert.alert(
          'Senha provisória',
          'Você está usando a senha enviada por email. Por segurança, altere-a na aba Perfil.'
        );
      }
    } catch (error) {
      Alert.alert('Erro de acesso', error.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://logodownload.org/wp-content/uploads/2014/10/senac-logo-1.png' }}
        style={styles.logo}
      />
      <Text style={styles.subtitle}>Insira suas informações de acesso abaixo.</Text>

      <Text style={styles.label}>EMAIL OU MATRÍCULA</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email ou matrícula"
        placeholderTextColor="#999"
        value={identificador}
        onChangeText={setIdentificador}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>SENHA</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={fazerLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar no Sistema</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Esqueceusenha')}>
        <Text style={styles.forgot}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© 2026 SENAC - TODOS OS DIREITOS RESERVADOS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd', paddingHorizontal: 30, justifyContent: 'center' },
  logo: { width: 180, height: 80, resizeMode: 'contain', alignSelf: 'center', marginBottom: 40 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 10, marginBottom: 40 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#9CA3AF', marginBottom: 10, marginTop: 5 },
  input: { backgroundColor: '#E8EEF7', borderRadius: 15, paddingHorizontal: 20, height: 56, fontSize: 14, marginBottom: 15 },
  button: { backgroundColor: '#FF6B00', height: 56, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  forgot: { textAlign: 'center', marginTop: 10, color: '#2563EB', fontSize: 14 },
  footer: { textAlign: 'center', marginTop: 50, color: '#C0C0C0', fontSize: 12 },
});
