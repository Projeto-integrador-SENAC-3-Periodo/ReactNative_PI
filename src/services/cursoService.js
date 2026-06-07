// ============================================================
//  cursoService.js — cursos do aluno
// ============================================================

import { apiRequest } from './api';

/**
 * Lista os cursos em que o aluno está matriculado.
 * GET /cursos/aluno/{alunoId}
 * @returns {UsuarioCursoResponseDTO[]}
 */
export async function listarCursosDoAluno(alunoId, token) {
  return apiRequest(`/cursos/aluno/${alunoId}`, { method: 'GET' }, token);
}
