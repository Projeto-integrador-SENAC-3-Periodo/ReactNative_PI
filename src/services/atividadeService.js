import { apiRequest, apiUpload } from './api';

/**
 * Submete uma nova atividade com comprovante (dispara OCR no backend).
 * POST /atividades/submeter  — multipart/form-data
 *
 * @param {object} params
 * @param {number}  params.idAluno
 * @param {string}  params.categoriaFixa   - 'ENSINO' | 'PESQUISA' | 'EXTENSAO'
 * @param {string}  [params.tipoAtividade] - id do tipo (opcional)
 * @param {string}  [params.descricao]
 * @param {number}  params.horasSolicitadas
 * @param {number}  params.idCurso
 * @param {object}  params.arquivo         - { uri, name, type } do DocumentPicker/ImagePicker
 * @param {string}  token                  - JWT do aluno
 */
export async function submeterAtividade(params, token) {
  const formData = new FormData();

  formData.append('idAluno', String(params.idAluno));
  formData.append('categoriaFixa', params.categoriaFixa);
  formData.append('horasSolicitadas', String(params.horasSolicitadas));
  formData.append('idCurso', String(params.idCurso));

  if (params.tipoAtividade) {
    formData.append('tipoAtividade', String(params.tipoAtividade));
  }
  if (params.descricao) {
    formData.append('descricao', params.descricao);
  }

  // Anexa o arquivo (comprovante) — o backend vai passar pelo OCR
  formData.append('comprovante', {
    uri: params.arquivo.uri,
    name: params.arquivo.name || 'comprovante.jpg',
    type: params.arquivo.mimeType || params.arquivo.type || 'image/jpeg',
  });

  return apiUpload('/atividades/submeter', formData, token);
}

/**
 * Lista todas as atividades do aluno.
 * GET /atividades/aluno/{alunoId}
 */
export async function listarAtividadesAluno(alunoId, token) {
  return apiRequest(`/atividades/aluno/${alunoId}`, { method: 'GET' }, token);
}

/**
 * Consulta o resumo de horas de um aluno num curso.
 * GET /atividades/horas/aluno/{alunoId}/curso/{cursoId}
 * @returns {HorasAlunoResponseDTO}
 */
export async function consultarHoras(alunoId, cursoId, token) {
  return apiRequest(
    `/atividades/horas/aluno/${alunoId}/curso/${cursoId}`,
    { method: 'GET' },
    token
  );
}

/**
 * Busca detalhes de uma atividade pelo id.
 * GET /atividades/{id}
 */
export async function buscarAtividade(id, token) {
  return apiRequest(`/atividades/${id}`, { method: 'GET' }, token);
}