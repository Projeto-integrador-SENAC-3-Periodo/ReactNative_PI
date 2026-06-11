import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCursos } from '../hooks/useCursos';
import CursoSelector from '../components/CursoSelector';
import { consultarHoras, listarAtividadesAluno } from '../services/atividadeService';

export default function Dashboard() {
  const { user, cursoAtivo, setCursoAtivo } = useAuth();
  const { cursos, loading: cursosLoading }  = useCursos();

  const [horas, setHoras]         = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
    if (!cursoAtivo) return;
    setLoading(true);
    try {
      const [horasData, atividadesData] = await Promise.all([
        consultarHoras(user.id, cursoAtivo.idCurso, user.token),
        listarAtividadesAluno(user.id, user.token),
      ]);
      setHoras(horasData);
      // Filtra apenas as atividades do curso selecionado
      const doCurso = (atividadesData || []).filter(a => a.idCurso === cursoAtivo.idCurso);
      setAtividades(doCurso);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Falha ao carregar dados.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, cursoAtivo]);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  function onRefresh() { setRefreshing(true); carregarDados(); }

  const aprovadas   = horas?.horasAprovadas ?? 0;
  const limite      = horas?.horasLimite    ?? 0;
  const porcentagem = limite > 0 ? Math.min(Math.round((aprovadas / limite) * 100), 100) : 0;
  const faltam      = horas?.horasRestantes ?? 0;

  function horasPorCategoria(cat) {
    return atividades
      .filter((a) => a.status === 'APROVADO' && a.categoriaFixa === cat)
      .reduce((acc, a) => acc + (a.horasAprovadas ?? 0), 0);
  }

  const ultimasAtividades = [...atividades]
    .sort((a, b) => new Date(b.dataSubmissao) - new Date(a.dataSubmissao))
    .slice(0, 3);

  const COR_STATUS  = { APROVADO: '#10B981', REPROVADO: '#EF4444', PENDENTE: '#F59E0B' };
  const LABEL_STATUS = { APROVADO: 'Aprovada', REPROVADO: 'Reprovada', PENDENTE: 'Em análise' };

  if (cursosLoading) {
    return <View style={s.center}><ActivityIndicator size="large" color="#0F2557" /></View>;
  }

  return (
    <ScrollView style={s.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

      <View style={s.header}>
        <Text style={s.headerTitle}>DASHBOARD</Text>
        {user?.nome ? <Text style={s.headerSub}>Olá, {user.nome.split(' ')[0]}!</Text> : null}
      </View>

      {/* SELETOR DE CURSO */}
      <View style={{ backgroundColor: '#0F2557', paddingHorizontal: 0, paddingBottom: 10 }}>
        <CursoSelector cursos={cursos} cursoAtivo={cursoAtivo} onSelect={setCursoAtivo} />
      </View>

      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color="#0F2557" style={{ marginTop: 40 }} /></View>
      ) : (
        <>
          {/* CARD GERAL */}
          <View style={s.mainCard}>
            <Text style={s.cardTitle}>HORAS APROVADAS — {cursoAtivo?.nomeCurso || ''}</Text>
            <View style={s.row}>
              <Text style={s.hours}>{aprovadas}<Text style={s.total}> / {limite}h</Text></Text>
              <View style={s.circle}><Text style={s.circleText}>{porcentagem}%</Text></View>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progress, { width: `${porcentagem}%` }]} />
            </View>
            <Text style={s.remaining}>
              {faltam > 0 ? `Faltam ${faltam}h para concluir.` : 'Horas concluídas!'}
            </Text>
          </View>

          {/* CATEGORIAS */}
          <Text style={s.sectionTitle}>Horas por Categoria</Text>
          {[
            { label: 'Ensino',    cat: 'ENSINO',    limite: 100 },
            { label: 'Extensão',  cat: 'EXTENSAO',  limite: 60  },
            { label: 'Pesquisa',  cat: 'PESQUISA',  limite: 20  },
          ].map(({ label, cat, limite: lim }) => {
            const h   = horasPorCategoria(cat);
            const pct = lim > 0 ? Math.min(Math.round((h / lim) * 100), 100) : 0;
            return (
              <View key={cat} style={s.categoryCard}>
                <Text style={s.categoryTitle}>{label}</Text>
                <View style={s.row}>
                  <Text style={s.hours}>{h}<Text style={s.total}> / {lim}h</Text></Text>
                  <View style={s.circle}><Text style={s.circleText}>{pct}%</Text></View>
                </View>
                <View style={s.progressBar}>
                  <View style={[s.progress, { width: `${pct}%` }]} />
                </View>
                <Text style={s.remaining}>
                  {lim - h > 0 ? `Faltam ${lim - h}h` : 'Concluído!'}
                </Text>
              </View>
            );
          })}

          {/* ÚLTIMAS ATIVIDADES */}
          <Text style={s.sectionTitle}>Últimas atividades</Text>
          {ultimasAtividades.length === 0 ? (
            <View style={s.activityCard}>
              <Text style={s.activityTitle}>Nenhuma atividade enviada</Text>
            </View>
          ) : ultimasAtividades.map((a) => (
            <View key={a.id} style={[s.activityCard, { borderLeftColor: COR_STATUS[a.status] }]}>
              <Text style={s.activityTitle}>{a.nomeTipoAtividade || a.categoriaFixa}</Text>
              {a.descricao ? <Text style={s.activitySub}>{a.descricao.substring(0, 60)}</Text> : null}
              <Text style={[s.activityStatus, { color: COR_STATUS[a.status] }]}>
                {LABEL_STATUS[a.status]} · {a.horasAprovadas ?? a.horasSolicitadas}h
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F3F4F6' },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:        { backgroundColor: '#0F2557', paddingTop: 60, paddingBottom: 10, borderBottomWidth: 3, borderBottomColor: '#F97316' },
  headerTitle:   { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  headerSub:     { color: '#CBD5E1', fontSize: 13, textAlign: 'center', marginTop: 4 },
  mainCard:      { backgroundColor: '#0F2557', margin: 10, borderRadius: 12, padding: 15 },
  cardTitle:     { color: '#FFF', fontSize: 13, marginBottom: 6 },
  row:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hours:         { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  total:         { fontSize: 18 },
  circle:        { width: 50, height: 50, borderWidth: 2, borderColor: '#FFF', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  circleText:    { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  progressBar:   { height: 6, backgroundColor: '#5A6B90', borderRadius: 5, marginTop: 10 },
  progress:      { height: 6, backgroundColor: '#F5F5F5', borderRadius: 5 },
  remaining:     { color: '#FFF', marginTop: 6, fontSize: 12 },
  sectionTitle:  { fontSize: 20, fontWeight: 'bold', color: '#0F2557', margin: 15 },
  categoryCard:  { backgroundColor: '#0d2b3f', marginHorizontal: 10, marginVertical: 6, borderRadius: 10, padding: 10 },
  categoryTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  activityCard:  { backgroundColor: '#FFF', marginHorizontal: 10, marginBottom: 8, padding: 15, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#F97316' },
  activityTitle: { fontWeight: 'bold', fontSize: 16 },
  activitySub:   { color: '#6B7280', fontSize: 12, marginTop: 2 },
  activityStatus:{ marginTop: 5, fontWeight: 'bold', fontSize: 13 },
});