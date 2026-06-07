import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, StyleSheet,
} from 'react-native';
 
export default function CursoSelector({ cursos, cursoAtivo, onSelect }) {
  const [aberto, setAberto] = useState(false);
 
  if (!cursos || cursos.length <= 1) return null; // esconde se só tem 1 curso
 
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.trigger} onPress={() => setAberto(true)}>
        <Text style={styles.triggerLabel}>Curso:</Text>
        <Text style={styles.triggerValue} numberOfLines={1}>
          {cursoAtivo?.nomeCurso || 'Selecionar...'}
        </Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>
 
      <Modal visible={aberto} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setAberto(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Selecione o curso</Text>
            <FlatList
              data={cursos}
              keyExtractor={(item) => String(item.idCurso)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    cursoAtivo?.idCurso === item.idCurso && styles.optionAtiva,
                  ]}
                  onPress={() => {
                    onSelect({ idCurso: item.idCurso, nomeCurso: item.nomeCurso });
                    setAberto(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      cursoAtivo?.idCurso === item.idCurso && styles.optionTextAtiva,
                    ]}
                  >
                    {item.nomeCurso}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
 
const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 10, marginBottom: 6 },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A6E',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  triggerLabel: { color: '#94A3B8', fontSize: 12, marginRight: 6 },
  triggerValue: { flex: 1, color: '#FFF', fontWeight: '600', fontSize: 14 },
  arrow: { color: '#F97316', fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F2557', marginBottom: 12 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#F3F4F6',
  },
  optionAtiva: { backgroundColor: '#0F2557' },
  optionText: { fontSize: 15, color: '#374151' },
  optionTextAtiva: { color: '#FFF', fontWeight: '600' },
});