import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';

export default function Login({ navigation }) {

  const fazerLogin = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>

      <Image
        source={{
          uri: 'https://logodownload.org/wp-content/uploads/2014/10/senac-logo-1.png'
        }}
        style={styles.logo}
      />

      <Text style={styles.subtitle}>
        Insira suas informações de acesso abaixo.
      </Text>

      {/* Campo Email */}
      <Text style={styles.label}>EMAIL OU MATRÍCULA</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        placeholderTextColor="#999"
      />

      {/* Campo Senha */}
      <Text style={styles.label}>SENHA</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#999"
        secureTextEntry={true}
      />

      {/* Botão Entrar */}
      <TouchableOpacity
        style={styles.button}
        onPress={fazerLogin}
      >
        <Text style={styles.buttonText}>
          Entrar no Sistema
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Esqueceusenha")}>
        <Text style={styles.forgot}>
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        © 2026 SENAC - TODOS OS DIREITOS RESERVADOS
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },

  logo: {
    width: 180,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40,
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 10,
    marginTop: 5,
  },

  input: {
    backgroundColor: '#E8EEF7',
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 56,
    fontSize: 14,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#FF6B00',
    height: 56,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  forgot: {
    textAlign: 'center',
    marginTop: 10,
    color: '#2563EB',
    fontSize: 14,
  },

  footer: {
    textAlign: 'center',
    marginTop: 50,
    color: '#C0C0C0',
    fontSize: 12,
  },
});