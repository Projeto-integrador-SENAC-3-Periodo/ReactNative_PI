import { apiRequest } from './api';

/**
 * Lista tipos de atividade ativos de uma categoria.
 * GET /tipos-atividade/categoria/{categoria}
 */
export async function listarPorCategoria(categoria, token) {
  const data = await apiRequest(
    `/tipos-atividade/categoria/${categoria}`,
    { method: 'GET' },
    token
  );
  // Garante que só retorna ativos
  return (data || []).filter((t) => t.ativo !== false);
}