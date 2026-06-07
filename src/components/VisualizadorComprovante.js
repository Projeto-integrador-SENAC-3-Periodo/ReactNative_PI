import React from 'react';
import {
  Modal, View, Text, Image, TouchableOpacity,
  StyleSheet, Linking, ActivityIndicator, ScrollView,
} from 'react-native';

export default function VisualizadorComprovante({ visible, url, onFechar }) {
  const isPdf = url && url.toLowerCase().includes('.pdf');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.titulo}>Comprovante</Text>

          {!url ? (
            <View style={s.centro}>
              <Text style={s.aviso}>Nenhum arquivo disponível.</Text>
            </View>
          ) : isPdf ? (
            // PDF — não renderiza inline, abre no navegador
            <View style={s.pdfBox}>
              <Text style={s.pdfEmoji}>📄</Text>
              <Text style={s.pdfInfo}>
                PDFs não podem ser exibidos diretamente no app.
              </Text>
              <TouchableOpacity style={s.abrirBtn} onPress={() => Linking.openURL(url)}>
                <Text style={s.abrirBtnText}>Abrir PDF no navegador</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Imagem — exibe direto
            <ScrollView
              maximumZoomScale={3}
              minimumZoomScale={1}
              centerContent
              style={{ width: '100%' }}
            >
              <Image
                source={{ uri: url }}
                style={s.imagem}
                resizeMode="contain"
              />
            </ScrollView>
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
  overlay:      { flex:1, backgroundColor:'rgba(0,0,0,0.88)', justifyContent:'center', alignItems:'center', padding:16 },
  card:         { backgroundColor:'#FFF', borderRadius:12, width:'100%', maxHeight:'90%', padding:16, alignItems:'center' },
  titulo:       { fontSize:16, fontWeight:'bold', color:'#0F2557', marginBottom:12 },
  centro:       { paddingVertical:40, alignItems:'center' },
  aviso:        { color:'#6B7280', fontSize:14 },
  imagem:       { width:'100%', height:460 },
  pdfBox:       { alignItems:'center', paddingVertical:30 },
  pdfEmoji:     { fontSize:64 },
  pdfInfo:      { color:'#6B7280', fontSize:13, textAlign:'center', marginTop:10, marginBottom:20, lineHeight:20 },
  abrirBtn:     { backgroundColor:'#2563EB', borderRadius:8, paddingVertical:12, paddingHorizontal:24 },
  abrirBtnText: { color:'#FFF', fontWeight:'bold', fontSize:15 },
  fecharBtn:    { backgroundColor:'#F97316', borderRadius:8, padding:14, alignItems:'center', marginTop:16, width:'100%' },
  fecharBtnText:{ color:'#FFF', fontWeight:'bold', fontSize:15 },
});
