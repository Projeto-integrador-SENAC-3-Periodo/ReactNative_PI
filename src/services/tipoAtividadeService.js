import { apiRequest } from './api';
 
/**
 * Lista tipos de atividade ativos de uma categoria.
 * GET /tipos-atividade/categoria/{categoria}
 * @param {'ENSINO'|'PESQUISA'|'EXTENSAO'} categoria
 */
export async function listarPorCategoria(categoria, token) {
  return apiRequest(`/tipos-atividade/categoria/${categoria}`, { method: 'GET' }, token);
}