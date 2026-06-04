import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PerfilScreen() {
  const [editando, setEditando] = useState(false);

  const [nome, setNome] = useState('Aluno');
  const [email] = useState('aluno@email.com');
  const [matricula] = useState('0030020044');
  const [foto, setFoto] = useState(null);

  async function escolherFoto() {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita acesso à galeria para alterar a foto.'
        );
        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

      if (!resultado.canceled) {
        setFoto(resultado.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível selecionar a foto.'
      );
    }
  }

  function removerFoto() {
    Alert.alert(
      'Remover Foto',
      'Deseja remover sua foto de perfil?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => setFoto(null),
        },
      ]
    );
  }

  function salvar() {
    setEditando(false);

    Alert.alert(
      'Sucesso',
      'Perfil atualizado com sucesso!'
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          PERFIL
        </Text>
      </View>

      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={escolherFoto}
      >
        {foto ? (
          <Image
            source={{ uri: foto }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {nome.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.changePhoto}>
        Toque na foto para alterar
      </Text>

      {foto && (
        <TouchableOpacity onPress={removerFoto}>
          <Text style={styles.removePhoto}>
            Remover Foto
          </Text>
        </TouchableOpacity>
      )}

      {editando ? (
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
        />
      ) : (
        <Text style={styles.name}>
          {nome}
        </Text>
      )}

      <Text style={styles.info}>
        {email}
      </Text>

      <Text style={styles.info}>
        Matrícula: {matricula}
      </Text>

      {!editando ? (
        <>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setEditando(true)}
          >
            <Text style={styles.primaryButtonText}>
              Editar Perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              Alterar Senha
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={salvar}
        >
          <Text style={styles.primaryButtonText}>
            Salvar Alterações
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    alignItems: 'center',
  },

  header: {
    width: '100%',
    backgroundColor: '#0F2A56',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#F37021',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  avatarContainer: {
    marginTop: 35,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#0F2A56',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: 'bold',
  },

  changePhoto: {
    marginTop: 12,
    color: '#F37021',
    fontWeight: '600',
  },

  removePhoto: {
    marginTop: 8,
    color: '#DC2626',
    fontWeight: '600',
  },

  name: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F2A56',
  },

  input: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
  },

  info: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 15,
  },

  primaryButton: {
    width: 230,
    backgroundColor: '#F37021',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  secondaryButton: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },

  secondaryButtonText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 15,
  },
});