import React, { useState } from 'react';
import {
  Modal, View, Text, Image, TouchableOpacity,
  StyleSheet, Linking, ActivityIndicator, Alert, Platform,
} from 'react-native';

function urlEhImagem(url, mimeType) {
  if (!url) return false;
  // Se tiver mimeType explícito, usa ele
  if (mimeType) return mimeType.startsWith('image/');
  // URL do Cloudinary com /image/upload/ é imagem
  if (url.includes('/image/upload/')) return true;
  if (url.includes('cloudinary') && !url.includes('.pdf')) return true;
  // Arquivo local: só considera imagem se tiver extensão de imagem
  if (url.startsWith('file://') || url.startsWith('content://')) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }
  return /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
}

async function abrirNoNavegador(url) {
  try {
    // Google Docs Viewer consegue renderizar PDF no browser do celular
    const viewer = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`;
    const suportado = await Linking.canOpenURL(viewer);
    if (suportado) {
      await Linking.openURL(viewer);
    } else {
      // Tenta abrir a URL direta como fallback
      await Linking.openURL(url);
    }
  } catch (e) {
    Alert.alert('Erro', 'Não foi possível abrir o arquivo.\n\nURL: ' + url);
  }
}

export default function VisualizadorComprovante({ visible, url, mimeType, onFechar }) {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro]             = useState(false);
  const ehImagem = urlEhImagem(url, mimeType);

  function aoAbrir() {
    setCarregando(true);
    setErro(false);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={aoAbrir}>
      <View style={s.overlay}>
        <View style={s.card}>

          <View style={s.topBar}>
            <Text style={s.titulo}>Comprovante</Text>
            <TouchableOpacity onPress={onFechar} style={s.fecharTopo}>
              <Text style={s.fecharTopoText}>✕</Text>
            </TouchableOpacity>
          </View>

          {!url ? (
            <View style={s.centro}>
              <Text style={s.aviso}>Nenhum arquivo disponível.</Text>
            </View>

          ) : ehImagem ? (
            // ── IMAGEM ──
            <View style={s.imagemContainer}>
              {carregando && !erro && (
                <View style={[StyleSheet.absoluteFill, s.centro]}>
                  <ActivityIndicator size="large" color="#0F2557" />
                  <Text style={{ color:'#6B7280', marginTop:8 }}>Carregando imagem...</Text>
                </View>
              )}
              {!erro && (
                <Image
                  source={{ uri: url }}
                  style={s.imagem}
                  resizeMode="contain"
                  onLoadStart={() => { setCarregando(true); setErro(false); }}
                  onLoadEnd={() => setCarregando(false)}
                  onError={() => { setCarregando(false); setErro(true); }}
                />
              )}
              {erro && (
                <View style={s.centro}>
                  <Text style={s.aviso}>Não foi possível carregar a imagem.</Text>
                  <TouchableOpacity style={s.btn} onPress={() => abrirNoNavegador(url)}>
                    <Text style={s.btnText}>Abrir no navegador</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

          ) : (
            // ── PDF ──
            <View style={s.pdfBox}>
              <Text style={s.pdfTitulo}>Documento PDF</Text>
              <Text style={s.pdfInfo}>
                Toque no botão abaixo para abrir o PDF no navegador do seu celular.
              </Text>
              <TouchableOpacity style={s.btn} onPress={() => abrirNoNavegador(url)}>
                <Text style={s.btnText}>Abrir PDF</Text>
              </TouchableOpacity>

            </View>
          )}

          <TouchableOpacity style={s.fecharBtn} onPress={onFechar}>
            <Text style={s.fecharBtnText}>Fechar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay:         { flex:1, backgroundColor:'rgba(0,0,0,0.92)', justifyContent:'flex-end' },
  card:            { backgroundColor:'#FFF', borderTopLeftRadius:16, borderTopRightRadius:16, maxHeight:'95%', paddingBottom:20 },
  topBar:          { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:16, borderBottomWidth:1, borderBottomColor:'#E5E7EB' },
  titulo:          { fontSize:16, fontWeight:'bold', color:'#0F2557' },
  fecharTopo:      { width:32, height:32, borderRadius:16, backgroundColor:'#F3F4F6', justifyContent:'center', alignItems:'center' },
  fecharTopoText:  { fontSize:16, color:'#6B7280', fontWeight:'bold' },
  centro:          { flex:1, justifyContent:'center', alignItems:'center', padding:20, minHeight:200 },
  aviso:           { color:'#6B7280', fontSize:14, textAlign:'center', marginBottom:16 },
  imagemContainer: { width:'100%', height:480, justifyContent:'center', backgroundColor:'#F8FAFC' },
  imagem:          { width:'100%', height:480 },
  pdfBox:          { alignItems:'center', paddingVertical:40, paddingHorizontal:24 },
  pdfEmoji:        { fontSize:72 },
  pdfTitulo:       { fontSize:18, fontWeight:'bold', color:'#0F2557', marginTop:12 },
  pdfInfo:         { color:'#6B7280', fontSize:13, textAlign:'center', marginTop:8, marginBottom:24, lineHeight:20 },
  btn:             { backgroundColor:'#2563EB', borderRadius:8, paddingVertical:14, paddingHorizontal:28, width:'100%', alignItems:'center' },
  btnText:         { color:'#FFF', fontWeight:'bold', fontSize:15 },
  fecharBtn:       { backgroundColor:'#F97316', borderRadius:8, padding:14, alignItems:'center', marginHorizontal:16, marginTop:12 },
  fecharBtnText:   { color:'#FFF', fontWeight:'bold', fontSize:15 },
});