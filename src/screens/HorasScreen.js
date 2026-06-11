import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCursos } from '../hooks/useCursos';
import CursoSelector from '../components/CursoSelector';
import VisualizadorComprovante from '../components/VisualizadorComprovante';
import { listarAtividadesAluno, consultarHoras } from '../services/atividadeService';

const STATUS_LABEL = { APROVADO: 'Aprovada', PENDENTE: 'Em análise', REPROVADO: 'Reprovada' };
const STATUS_COR   = { APROVADO: '#10B981', PENDENTE: '#F59E0B', REPROVADO: '#EF4444' };
const FILTROS      = [
  { key: 'todos',    label: 'Todos',     status: null        },
  { key: 'aprovada', label: 'Aprovadas', status: 'APROVADO'  },
  { key: 'analise',  label: 'Análise',   status: 'PENDENTE'  },
  { key: 'recusada', label: 'Recusadas', status: 'REPROVADO' },
];

export default function HorasScreen() {
  const { user, cursoAtivo, setCursoAtivo } = useAuth();
  const { cursos, loading: cursosLoading }  = useCursos();

  const [filtro, setFiltro]         = useState('todos');
  const [atividades, setAtividades] = useState([]);
  const [horas, setHoras]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [urlVer, setUrlVer]         = useState(null);

  // ── Carrega quando cursoAtivo estiver disponível ──
  const carregar = useCallback(async (cursoId) => {
    if (!cursoId) return;
    setLoading(true);
    try {
      const [atividadesData, horasData] = await Promise.all([
        listarAtividadesAluno(user.id, user.token),
        consultarHoras(user.id, cursoId, user.token),
      ]);
      console.log('Atividades carregadas:', atividadesData?.length, atividadesData?.[0]);
      // Filtra apenas as atividades do curso selecionado
      const doCurso = (atividadesData || []).filter(a => a.idCurso === cursoId);
      setAtividades(doCurso);
      setHoras(horasData);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Falha ao carregar atividades.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Re-executa sempre que cursoAtivo mudar
  useEffect(() => {
    if (cursoAtivo?.idCurso) carregar(cursoAtivo.idCurso);
  }, [cursoAtivo, carregar]);

  function onRefresh() {
    setRefreshing(true);
    carregar(cursoAtivo?.idCurso);
  }

  const filtroAtual = FILTROS.find((f) => f.key === filtro);
  const filtradas   = filtroAtual?.status
    ? atividades.filter((a) => a.status === filtroAtual.status)
    : atividades;

  const aprovadas   = horas?.horasAprovadas ?? 0;
  const limite      = horas?.horasLimite    ?? 0;
  const porcentagem = limite > 0 ? Math.min(Math.round((aprovadas / limite) * 100), 100) : 0;

  function formatarData(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  }

  if (cursosLoading) {
    return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" color="#0F2A56" />
    </View>;
  }

  return (
    <View style={{ flex:1, backgroundColor:'#F3F4F6' }}>

      {/* VISUALIZADOR */}
      <VisualizadorComprovante
        visible={!!urlVer}
        url={urlVer}
        onFechar={() => setUrlVer(null)}
      />

      {/* HEADER */}
      <View style={{ backgroundColor:'#0F2A56', paddingTop:60, paddingBottom:0 }}>
        <Text style={{ color:'#FFF', fontSize:18, fontWeight:'bold', textAlign:'center', paddingBottom:10 }}>
          ACOMPANHAMENTO
        </Text>
        <CursoSelector cursos={cursos} cursoAtivo={cursoAtivo} onSelect={setCursoAtivo} />
      </View>

      {/* PROGRESSO */}
      <View style={{ backgroundColor:'#102C5B', margin:10, borderRadius:10, padding:12 }}>
        <Text style={{ color:'#FFF', fontSize:12, marginBottom:8 }}>
          HORAS — {cursoAtivo?.nomeCurso || 'Carregando...'}
        </Text>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
          <Text style={{ color:'#FFF', fontSize:28, fontWeight:'bold' }}>
            {aprovadas}h <Text style={{ fontSize:14 }}>/ {limite}h</Text>
          </Text>
          <View style={{ width:50, height:50, borderRadius:25, borderWidth:3, borderColor:'#F37021', justifyContent:'center', alignItems:'center' }}>
            <Text style={{ color:'#FFF', fontWeight:'bold', fontSize:12 }}>{porcentagem}%</Text>
          </View>
        </View>
        <View style={{ height:6, backgroundColor:'#5A6B88', borderRadius:5, marginTop:10 }}>
          <View style={{ width:`${porcentagem}%`, height:6, backgroundColor:'#F37021', borderRadius:5 }} />
        </View>
        <Text style={{ color:'#FFF', fontSize:11, marginTop:6 }}>
          {horas?.horasRestantes > 0 ? `Faltam ${horas.horasRestantes}h` : limite > 0 ? 'Concluído!' : '—'}
        </Text>
      </View>

      {/* FILTROS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:10, paddingVertical:5 }}>
        {FILTROS.map((f) => (
          <TouchableOpacity key={f.key} onPress={() => setFiltro(f.key)}
            style={{ paddingHorizontal:14, height:32, borderRadius:16, marginRight:8,
              justifyContent:'center', alignItems:'center',
              backgroundColor: filtro === f.key ? '#F37021' : '#E5E7EB' }}>
            <Text style={{ fontSize:11, fontWeight:'500', color: filtro === f.key ? '#FFF' : '#374151' }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA */}
      {loading && !refreshing ? (
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', marginTop:40 }}>
          <ActivityIndicator size="large" color="#0F2A56" />
          <Text style={{ color:'#9CA3AF', marginTop:10, fontSize:13 }}>Carregando atividades...</Text>
        </View>
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}>
          {!cursoAtivo ? (
            <Text style={{ textAlign:'center', marginTop:30, color:'#9CA3AF' }}>
              Selecione um curso acima.
            </Text>
          ) : filtradas.length === 0 ? (
            <Text style={{ textAlign:'center', marginTop:30, color:'#9CA3AF' }}>
              {filtro === 'todos'
                ? 'Nenhuma atividade enviada ainda.'
                : `Nenhuma atividade ${FILTROS.find(f=>f.key===filtro)?.label.toLowerCase()}.`}
            </Text>
          ) : (
            filtradas.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => item.comprovanteUrl ? setUrlVer(item.comprovanteUrl) : null}
                activeOpacity={item.comprovanteUrl ? 0.7 : 1}
                style={{
                  backgroundColor:'#FFF', marginHorizontal:10, marginBottom:8,
                  padding:12, borderRadius:8,
                  borderLeftWidth:4, borderLeftColor: STATUS_COR[item.status] || '#9CA3AF',
                }}
              >
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <View style={{ flex:1, marginRight:10 }}>
                    <Text style={{ fontSize:14, fontWeight:'bold' }}>
                      {item.nomeTipoAtividade || item.categoriaFixa}
                    </Text>
                    <Text style={{ fontSize:11, color:'#666', marginTop:2 }}>
                      {item.categoriaFixa} · {formatarData(item.dataSubmissao)}
                    </Text>
                    {item.descricao ? (
                      <Text style={{ fontSize:11, color:'#6B7280', marginTop:2 }} numberOfLines={2}>
                        {item.descricao}
                      </Text>
                    ) : null}
                    <Text style={{ marginTop:4, fontSize:11, fontWeight:'600', color: STATUS_COR[item.status] }}>
                      {STATUS_LABEL[item.status] || item.status}
                    </Text>
                    {item.status === 'REPROVADO' && item.motivoReprovacao ? (
                      <Text style={{ fontSize:10, color:'#EF4444', marginTop:2 }}>
                        Motivo: {item.motivoReprovacao}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ alignItems:'flex-end' }}>
                    <Text style={{ fontSize:14, fontWeight:'bold', color:'#0F2A56' }}>
                      {item.horasAprovadas ?? item.horasSolicitadas}h
                    </Text>
                    {item.comprovanteUrl ? (
                      <Text style={{ fontSize:11, color:'#2563EB', marginTop:6 }}>Ver</Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}