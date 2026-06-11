import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, TextInput, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { alterarSenha } from '../services/authService';
import { atualizarPerfil } from '../services/userService';

export default function PerfilScreen() {
  const { user, signOut, atualizarUser } = useAuth();

  const [foto, setFoto] = useState(null);

  // ── EDITAR PERFIL ──
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [novoNome, setNovoNome]   = useState(user?.nome  || '');
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  // ── ALTERAR SENHA ──
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [senhaAtual, setSenhaAtual]       = useState('');
  const [novaSenha, setNovaSenha]         = useState('');
  const [confirmacao, setConfirmacao]     = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  async function escolherFoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permissão necessária', 'Permita acesso à galeria.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!result.canceled) setFoto(result.assets[0].uri);
  }

  async function salvarPerfil() {
    if (!novoNome.trim()) { Alert.alert('Atenção', 'O nome não pode ficar vazio.'); return; }
    setSalvandoPerfil(true);
    try {
      const resposta = await atualizarPerfil(user.id, {nome: novoNome.trim()}, user.token);
      atualizarUser({ nome: resposta.nome});
      Alert.alert('Sucesso', 'Perfil atualizado!');
      setEditandoPerfil(false);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível atualizar.');
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function salvarSenha() {
    if (!senhaAtual || !novaSenha || !confirmacao) { Alert.alert('Atenção', 'Preencha todos os campos.'); return; }
    setSalvandoSenha(true);
    try {
      await alterarSenha(user.token, senhaAtual, novaSenha, confirmacao);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setAlterandoSenha(false);
      setSenhaAtual(''); setNovaSenha(''); setConfirmacao('');
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível alterar a senha.');
    } finally {
      setSalvandoSenha(false);
    }
  }

  function fazerLogout() {
    Alert.alert('Sair', 'Deseja sair do sistema?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  }

  const inicialNome = user?.nome ? user.nome.charAt(0).toUpperCase() : '?';

  return (
    <ScrollView style={s.scroll} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <View style={s.header}>
        <Text style={s.headerTitle}>PERFIL</Text>
      </View>

      {/* AVATAR */}
      <TouchableOpacity style={s.avatarContainer} onPress={escolherFoto}>
        {foto
          ? <Image source={{ uri: foto }} style={s.avatar} />
          : <View style={s.avatar}><Text style={s.avatarText}>{inicialNome}</Text></View>}
      </TouchableOpacity>
      <Text style={s.changePhoto}>Toque na foto para alterar</Text>

      {/* DADOS */}
      {!editandoPerfil ? (
        <View style={s.dadosCard}>
          <Text style={s.nome}>{user?.nome || '—'}</Text>
          {user?.matricula ? <Text style={s.info}>Matrícula: {user.matricula}</Text> : null}
          <Text style={[s.info, { color: '#0F2557', fontWeight: '600' }]}>
            Perfil: {user?.perfil || '—'}
          </Text>

          {user?.senhaProvisoria && (
            <View style={s.avisoSenha}>
              <Text style={s.avisoSenhaText}>Você ainda usa a senha provisória. Altere-a abaixo.</Text>
            </View>
          )}

          <TouchableOpacity style={s.editBtn} onPress={() => {
            setNovoNome(user?.nome || '');
            setEditandoPerfil(true);
          }}>
            <Text style={s.editBtnText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // ── FORM EDITAR PERFIL ──
        <View style={s.formCard}>
          <Text style={s.formTitle}>Editar Perfil</Text>

          <Text style={s.label}>Nome</Text>
          <TextInput style={s.input} value={novoNome} onChangeText={setNovoNome} placeholder="Seu nome completo" />

          <TouchableOpacity
            style={[s.primaryButton, { marginTop: 16 }, salvandoPerfil && { opacity: 0.7 }]}
            onPress={salvarPerfil} disabled={salvandoPerfil}>
            {salvandoPerfil ? <ActivityIndicator color="#FFF" /> : <Text style={s.primaryButtonText}>Salvar</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryButton} onPress={() => setEditandoPerfil(false)}>
            <Text style={s.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── FORM ALTERAR SENHA ── */}
      {!alterandoSenha ? (
        <TouchableOpacity style={s.secondaryButton} onPress={() => setAlterandoSenha(true)}>
          <Text style={s.secondaryButtonText}>Alterar Senha</Text>
        </TouchableOpacity>
      ) : (
        <View style={s.formCard}>
          <Text style={s.formTitle}>Alterar Senha</Text>

          <Text style={s.label}>Senha atual</Text>
          <TextInput style={s.input} secureTextEntry value={senhaAtual} onChangeText={setSenhaAtual} placeholder="Senha atual" />
          <Text style={s.label}>Nova senha</Text>
          <TextInput style={s.input} secureTextEntry value={novaSenha} onChangeText={setNovaSenha} placeholder="Nova senha" />
          <Text style={s.label}>Confirmar nova senha</Text>
          <TextInput style={s.input} secureTextEntry value={confirmacao} onChangeText={setConfirmacao} placeholder="Confirme" />

          <TouchableOpacity style={[s.primaryButton, { marginTop: 16 }, salvandoSenha && { opacity:0.7 }]}
            onPress={salvarSenha} disabled={salvandoSenha}>
            {salvandoSenha ? <ActivityIndicator color="#FFF" /> : <Text style={s.primaryButtonText}>Salvar Senha</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryButton} onPress={() => setAlterandoSenha(false)}>
            <Text style={s.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LOGOUT */}
      <TouchableOpacity style={[s.secondaryButton, { marginTop: 20, borderColor: '#EF4444' }]} onPress={fazerLogout}>
        <Text style={[s.secondaryButtonText, { color: '#EF4444' }]}>Sair do Sistema</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:            { flex:1, backgroundColor:'#F4F6F9' },
  header:            { width:'100%', backgroundColor:'#0F2A56', paddingTop:60, paddingBottom:20, alignItems:'center', borderBottomWidth:3, borderBottomColor:'#F37021' },
  headerTitle:       { color:'#FFF', fontSize:20, fontWeight:'bold' },
  avatarContainer:   { marginTop:30 },
  avatar:            { width:120, height:120, borderRadius:60, backgroundColor:'#0F2A56', justifyContent:'center', alignItems:'center' },
  avatarText:        { color:'#FFF', fontSize:48, fontWeight:'bold' },
  changePhoto:       { marginTop:10, color:'#F37021', fontWeight:'600' },
  dadosCard:         { width:'85%', backgroundColor:'#FFF', borderRadius:12, padding:16, marginTop:20, alignItems:'center', borderWidth:1, borderColor:'#E2E8F0' },
  nome:              { fontSize:22, fontWeight:'bold', color:'#0F2A56', marginBottom:6 },
  info:              { color:'#64748B', fontSize:14, marginTop:4 },
  avisoSenha:        { marginTop:12, backgroundColor:'#FEF3C7', borderWidth:1, borderColor:'#F59E0B', borderRadius:8, padding:10 },
  avisoSenhaText:    { color:'#92400E', fontSize:12, textAlign:'center' },
  editBtn:           { marginTop:14, backgroundColor:'#EFF6FF', borderRadius:8, paddingVertical:10, paddingHorizontal:20, borderWidth:1, borderColor:'#BFDBFE' },
  editBtnText:       { color:'#1D4ED8', fontWeight:'600' },
  formCard:          { width:'85%', backgroundColor:'#FFF', borderRadius:12, padding:16, marginTop:16, borderWidth:1, borderColor:'#E2E8F0' },
  formTitle:         { fontSize:16, fontWeight:'bold', color:'#0F2A56', marginBottom:8 },
  label:             { fontSize:13, color:'#475569', marginBottom:4, marginTop:10 },
  input:             { backgroundColor:'#FFF', borderWidth:1, borderColor:'#D1D5DB', borderRadius:8, paddingHorizontal:12, height:48, width:'100%' },
  primaryButton:     { width:'100%', backgroundColor:'#F37021', padding:14, borderRadius:8, alignItems:'center' },
  primaryButtonText: { color:'#FFF', fontWeight:'bold', fontSize:15 },
  secondaryButton:   { width:230, backgroundColor:'#FFF', borderWidth:1, borderColor:'#CBD5E1', padding:14, borderRadius:8, alignItems:'center', marginTop:10 },
  secondaryButtonText: { color:'#475569', fontWeight:'bold', fontSize:14, textAlign:'center', padding:3, alignItems:'center'},
});