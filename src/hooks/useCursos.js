import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { listarCursosDoAluno } from '../services/cursoService';
import { useAuth } from '../context/AuthContext';
 
export function useCursos() {
  const { user, cursoAtivo, setCursoAtivo } = useAuth();
  const [cursos, setCursos]     = useState([]);
  const [loading, setLoading]   = useState(true);
 
  const carregar = useCallback(async () => {
    try {
      const data = await listarCursosDoAluno(user.id, user.token);
      setCursos(data || []);
 
      // Define curso ativo: mantém o atual se ainda existir, senão usa o primeiro
      if (data && data.length > 0) {
        const ainda = cursoAtivo && data.find((c) => c.idCurso === cursoAtivo.idCurso);
        if (!ainda) setCursoAtivo({ idCurso: data[0].idCurso, nomeCurso: data[0].nomeCurso });
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os cursos.');
    } finally {
      setLoading(false);
    }
  }, [user]);
 
  useEffect(() => { carregar(); }, [carregar]);
 
  return { cursos, cursoAtivo, setCursoAtivo, loading };
}