import { apiRequest } from './api';
 
/**
 * Aluno atualiza o próprio perfil (nome e/ou email).
 * PUT /usuarios/perfil/{id}
 */
export async function atualizarPerfil(id, dados, token) {
  return apiRequest(
    `/usuarios/perfil/${id}`,
    { method: 'PUT', body: JSON.stringify(dados) },
    token
  );
}