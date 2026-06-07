import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '../context/AuthContext';
import { useCursos } from '../hooks/useCursos';
import CursoSelector from '../components/CursoSelector';
import { submeterAtividade } from '../services/atividadeService';
import { listarPorCategoria } from '../services/tipoAtividadeService';
import { processarOcrLocal } from '../services/ocrLocal';
import VisualizadorComprovante from '../components/VisualizadorComprovante';

const CATEGORIAS = ['ENSINO', 'PESQUISA', 'EXTENSAO'];

export default function EnviarAtividade() {
  const { user, cursoAtivo, setCursoAtivo } = useAuth();
  const { cursos, loading: cursosLoading }  = useCursos();

  const [categoria, setCategoria]             = useState('');
  const [tiposAtividade, setTiposAtividade]   = useState([]);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [loadingTipos, setLoadingTipos]       = useState(false);
  const [descricao, setDescricao]             = useState('');
  const [horas, setHoras]                     = useState('');
  const [arquivo, setArquivo]                 = useState(null);
  const [enviando, setEnviando]               = useState(false);
  const [ocrProcessando, setOcrProcessando]   = useState(false);
  const [ocrResultado, setOcrResultado]       = useState(null);
  const [verCertificado, setVerCertificado]   = useState(false);

  // ── Busca tipos quando categoria muda ──
  useEffect(() => {
    if (!categoria) { setTiposAtividade([]); setTipoSelecionado(null); return; }
    setLoadingTipos(true);
    setTipoSelecionado(null);
    listarPorCategoria(categoria, user.token)
      .then((data) => setTiposAtividade(data || []))
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar os tipos de atividade.'))
      .finally(() => setLoadingTipos(false));
  }, [categoria]);

  function selecionarTipo(tipo) {
    setTipoSelecionado(tipo);
    if (tipo.horasMaximas && !horas) setHoras(String(tipo.horasMaximas));
  }

  // ── Seleciona arquivo e dispara OCR ──
  async function aoSelecionarArquivo(arq) {
    setArquivo(arq);
    setOcrResultado(null);
    setOcrProcessando(true);
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const resultado = await processarOcrLocal(arq.uri);

      // Preenche campos independente de ter achado tudo ou não
      if (resultado.sucesso) {
        setOcrResultado(resultado);

        // Preenche horas se detectado
        if (resultado.horasDetectadas) {
          setHoras(String(resultado.horasDetectadas));
        }

        // Preenche descrição: data se encontrou, ou primeiras palavras do texto
        if (resultado.dataDetectada) {
          setDescricao('Certificado emitido em ' + resultado.dataDetectada);
        } else if (resultado.textoCompleto) {
          // Usa as primeiras 80 chars do texto como descrição
          const resumo = resultado.textoCompleto
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 80);
          setDescricao(resumo);
        }
      } else {
        setOcrResultado({ sucesso: false, horasDetectadas: null, dataDetectada: null });
      }
    } catch (err) {
      setOcrResultado({ sucesso: false, horasDetectadas: null, dataDetectada: null });
    } finally {
      setOcrProcessando(false);
    }
  }

  async function selecionarArquivo() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!resultado.canceled) aoSelecionarArquivo(resultado.assets[0]);
    } catch { Alert.alert('Erro', 'Não foi possível selecionar o arquivo.'); }
  }

  async function tirarFoto() {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permissão negada', 'Permita o uso da câmera.'); return; }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled) aoSelecionarArquivo(result.assets[0]);
    } catch { Alert.alert('Erro', 'Não foi possível abrir a câmera.'); }
  }

  async function enviarAtividade() {
    if (!cursoAtivo)      { Alert.alert('Atenção', 'Selecione um curso.'); return; }
    if (!categoria)       { Alert.alert('Atenção', 'Selecione a categoria.'); return; }
    if (!tipoSelecionado) { Alert.alert('Atenção', 'Selecione o tipo de atividade.'); return; }
    if (!horas || isNaN(Number(horas)) || Number(horas) <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade de horas válida.'); return;
    }
    if (!arquivo) { Alert.alert('Atenção', 'Anexe o comprovante.'); return; }

    setEnviando(true);
    try {
      await submeterAtividade({
        idAluno: user.id,
        categoriaFixa: categoria,
        tipoAtividade: String(tipoSelecionado.id),
        descricao,
        horasSolicitadas: Number(horas),
        idCurso: cursoAtivo.idCurso,
        arquivo,
      }, user.token);
      Alert.alert('Enviado!', 'Sua atividade foi enviada e está em análise!');
      limparFormulario();
    } catch (error) {
      Alert.alert('Erro ao enviar', error.message || 'Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  function limparFormulario() {
    setCategoria('');
    setTipoSelecionado(null);
    setTiposAtividade([]);
    setDescricao('');
    setHoras('');
    setArquivo(null);
    setOcrResultado(null);
  }

  // ── Verifica se o arquivo é imagem (para o visualizador) ──
  function isImagem(arq) {
    if (!arq) return false;
    const tipo = arq.mimeType || arq.type || '';
    const nome = arq.name || arq.fileName || '';
    return tipo.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(nome);
  }

  if (cursosLoading) {
    return <View style={[s.container, { justifyContent:'center', alignItems:'center' }]}>
      <ActivityIndicator size="large" color="#0F2557" />
    </View>;
  }

  return (
    <ScrollView style={s.container}>

      {/* VISUALIZADOR DE CERTIFICADO */}
      <VisualizadorComprovante
        visible={verCertificado}
        url={arquivo?.uri}
        onFechar={() => setVerCertificado(false)}
      />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>ENVIAR ATIVIDADE</Text>
        <View style={{ paddingHorizontal:10, paddingBottom:10, paddingTop:6 }}>
          <CursoSelector cursos={cursos} cursoAtivo={cursoAtivo} onSelect={setCursoAtivo} />
        </View>
      </View>

      <View style={s.formCard}>

        {/* COMPROVANTE */}
        <Text style={s.label}>Comprovante / Certificado</Text>
        <Text style={s.hint}>Horas e data são lidos automaticamente ao selecionar.</Text>

        <TouchableOpacity style={s.fileButton} onPress={selecionarArquivo}>
          <Text style={s.fileButtonText}>Escolher da Galeria / Arquivo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.fileButton, { marginTop:8, backgroundColor:'#D1E8FF' }]} onPress={tirarFoto}>
          <Text style={s.fileButtonText}>Tirar Foto</Text>
        </TouchableOpacity>

        {/* ARQUIVO SELECIONADO */}
        {arquivo && (
          <TouchableOpacity style={s.arquivoBox} onPress={() => setVerCertificado(true)}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
              <Text style={s.fileName} numberOfLines={1}>
                {isImagem(arquivo)}
                {arquivo.name || arquivo.fileName || 'Foto selecionada'}
              </Text>
              <Text style={s.verBtn}>Ver</Text>
            </View>

            {/* STATUS OCR */}
            {ocrProcessando ? (
              <View style={s.ocrRow}>
                <ActivityIndicator size="small" color="#7b95db" />
                <Text style={s.ocrProcessandoText}> Lendo comprovante...</Text>
              </View>
            ) : ocrResultado ? (
              <View style={s.ocrBanner}>
                <Text style={s.ocrBannerTitle}>Leitura automática:</Text>
                <Text style={ocrResultado.horasDetectadas ? s.ocrAchou : s.ocrNaoAchou}>
                  {ocrResultado.horasDetectadas
                    ? `${ocrResultado.horasDetectadas}h detectadas → campo preenchido`
                    : 'Horas não encontradas → preencha manualmente'}
                </Text>
                <Text style={ocrResultado.dataDetectada ? s.ocrAchou : s.ocrNaoAchou}>
                  {ocrResultado.dataDetectada
                    ? `Data: ${ocrResultado.dataDetectada} → descrição preenchida`
                    : 'Data não encontrada → descrição preenchida com texto do certificado'}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        )}

        {/* CATEGORIA */}
        <Text style={s.label}>Categoria</Text>
        <View style={s.categoriasRow}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity key={cat}
              style={[s.categoriaBtn, categoria === cat && s.categoriaBtnAtivo]}
              onPress={() => setCategoria(cat)}>
              <Text style={[s.categoriaBtnText, categoria === cat && s.categoriaBtnTextAtivo]}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TIPO DE ATIVIDADE */}
        {categoria ? (
          <>
            <Text style={s.label}>Tipo de Atividade</Text>
            {loadingTipos ? (
              <ActivityIndicator size="small" color="#0F2557" style={{ marginVertical:8 }} />
            ) : tiposAtividade.length === 0 ? (
              <Text style={s.hint}>Nenhum tipo cadastrado para esta categoria.</Text>
            ) : (
              <View style={s.tiposContainer}>
                {tiposAtividade.map((tipo) => (
                  <TouchableOpacity key={tipo.id}
                    style={[s.tipoBtn, tipoSelecionado?.id === tipo.id && s.tipoBtnAtivo]}
                    onPress={() => selecionarTipo(tipo)}>
                    <Text style={[s.tipoBtnText, tipoSelecionado?.id === tipo.id && s.tipoBtnTextAtivo]}>
                      {tipo.nome}
                    </Text>
                    {tipo.horasMaximas
                      ? <Text style={[s.tipoHoras, tipoSelecionado?.id === tipo.id && { color:'#94A3B8' }]}>
                          máx. {tipo.horasMaximas}h
                        </Text>
                      : null}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {tipoSelecionado?.requisito ? (
              <View style={s.requisitoBox}>
                <Text style={s.requisitoText}>{tipoSelecionado.requisito}</Text>
              </View>
            ) : null}
          </>
        ) : null}

        {/* DESCRIÇÃO */}
        <Text style={s.label}>
          Descrição
          {ocrResultado?.sucesso
            ? <Text style={s.ocrLabel}> (preenchida pelo OCR ✓)</Text>
            : <Text style={s.optLabel}> (opcional)</Text>}
        </Text>
        <TextInput style={s.textArea} multiline numberOfLines={4}
          placeholder="Descreva sua atividade"
          value={descricao} onChangeText={setDescricao} />
        {ocrResultado?.sucesso
          ? <Text style={s.fieldNote}>Pode editar caso necessário.</Text>
          : null}

        {/* HORAS */}
        <Text style={s.label}>
          Quantidade de Horas
          {ocrResultado?.horasDetectadas
            ? <Text style={s.ocrLabel}> (detectado pelo OCR)</Text>
            : tipoSelecionado?.horasMaximas
              ? <Text style={s.optLabel}> (máx. {tipoSelecionado.horasMaximas}h)</Text>
              : null}
        </Text>
        <TextInput
          style={[s.input, ocrResultado?.horasDetectadas && s.inputOcr]}
          keyboardType="numeric"
          placeholder="Ex: 20"
          value={horas}
          onChangeText={setHoras}
        />
        {ocrResultado?.horasDetectadas
          ? <Text style={s.fieldNote}>Pode corrigir se o valor estiver errado.</Text>
          : null}

        <TouchableOpacity
          style={[s.submitButton, (enviando || ocrProcessando) && { opacity:0.6 }]}
          onPress={enviarAtividade}
          disabled={enviando || ocrProcessando}>
          {enviando
            ? <><ActivityIndicator color="#FFF" /><Text style={[s.submitButtonText,{marginLeft:8}]}>Enviando...</Text></>
            : <Text style={s.submitButtonText}>ENVIAR ATIVIDADE</Text>}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:           { flex:1, backgroundColor:'#F3F4F6' },
  header:              { backgroundColor:'#0F2557', paddingTop:60, borderBottomWidth:3, borderBottomColor:'#F97316' },
  headerTitle:         { color:'#FFF', fontSize:22, fontWeight:'bold', textAlign:'center', paddingBottom:6 },
  formCard:            { backgroundColor:'#FFF', margin:15, borderRadius:12, padding:15 },
  label:               { fontSize:14, fontWeight:'600', marginBottom:5, marginTop:10, color:'#0F2557' },
  ocrLabel:            { color:'#10B981', fontSize:11, fontWeight:'400' },
  optLabel:            { color:'#9CA3AF', fontSize:11, fontWeight:'400' },
  hint:                { fontSize:12, color:'#9CA3AF', marginBottom:8 },
  input:               { backgroundColor:'#FFF', borderWidth:1, borderColor:'#D1D5DB', borderRadius:8, paddingHorizontal:12, height:50 },
  inputOcr:            { borderColor:'#10B981', borderWidth:2 },
  textArea:            { backgroundColor:'#FFF', borderWidth:1, borderColor:'#D1D5DB', borderRadius:8, padding:12, height:100, textAlignVertical:'top' },
  fieldNote:           { fontSize:11, color:'#6B7280', marginTop:4 },
  fileButton:          { backgroundColor:'#E5E7EB', padding:14, borderRadius:8, alignItems:'center', marginTop:5 },
  fileButtonText:      { color:'#0F2557', fontWeight:'600' },
  arquivoBox:          { backgroundColor:'#F8FAFC', borderRadius:8, padding:12, marginTop:8, borderWidth:1, borderColor:'#E2E8F0' },
  fileName:            { color:'#1E293B', fontWeight:'600', flex:1 },
  verBtn:              { color:'#2563EB', fontSize:13, fontWeight:'600', marginLeft:8 },
  ocrRow:              { flexDirection:'row', alignItems:'center', marginTop:8 },
  ocrProcessandoText:  { color:'#1D4ED8', fontSize:13 },
  ocrBanner:           { backgroundColor:'#F0FDF4', borderRadius:6, padding:8, marginTop:8, borderWidth:1, borderColor:'#BBF7D0' },
  ocrBannerTitle:      { color:'#166534', fontWeight:'bold', fontSize:12, marginBottom:4 },
  ocrAchou:            { color:'#15803D', fontSize:12, marginTop:2 },
  ocrNaoAchou:         { color:'#9CA3AF', fontSize:12, marginTop:2 },
  categoriasRow:       { flexDirection:'row', gap:8, marginTop:4 },
  categoriaBtn:        { flex:1, paddingVertical:10, borderRadius:8, borderWidth:1, borderColor:'#D1D5DB', alignItems:'center' },
  categoriaBtnAtivo:   { backgroundColor:'#0F2557', borderColor:'#0F2557' },
  categoriaBtnText:    { color:'#0F2557', fontWeight:'600', fontSize:13 },
  categoriaBtnTextAtivo: { color:'#FFF' },
  tiposContainer:      { gap:6, marginTop:4 },
  tipoBtn:             { paddingVertical:12, paddingHorizontal:14, borderRadius:8, borderWidth:1, borderColor:'#D1D5DB', flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  tipoBtnAtivo:        { backgroundColor:'#0F2557', borderColor:'#0F2557' },
  tipoBtnText:         { color:'#374151', fontWeight:'500', flex:1 },
  tipoBtnTextAtivo:    { color:'#FFF' },
  tipoHoras:           { color:'#9CA3AF', fontSize:11 },
  requisitoBox:        { backgroundColor:'#FEF9C3', borderRadius:8, padding:10, marginTop:8, borderWidth:1, borderColor:'#FDE047' },
  requisitoText:       { color:'#713F12', fontSize:12 },
  submitButton:        { backgroundColor:'#F97316', height:55, borderRadius:8, flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:20 },
  submitButtonText:    { color:'#FFF', fontSize:16, fontWeight:'bold' },
  // Modal
});