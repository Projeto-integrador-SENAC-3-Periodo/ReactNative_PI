export const BASE_URL = 'https://back-end-lr3q.onrender.com';

/**
 * Faz uma requisição autenticada com o token JWT armazenado.
 * @param {string} endpoint   - ex: '/atividades/aluno/5'
 * @param {object} options    - opções do fetch (method, body, headers extras)
 * @param {string|null} token - JWT; se null, faz requisição sem Authorization
 */
export async function apiRequest(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Para respostas sem corpo (204 No Content)
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg =
      (typeof data === 'string' ? data : data?.message) ||
      `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

/**
 * Faz upload multipart/form-data (usado para enviar comprovantes com OCR).
 */
export async function apiUpload(endpoint, formData, token) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // NÃO defina Content-Type aqui — o fetch define automaticamente com o boundary
    },
    body: formData,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg =
      (typeof data === 'string' ? data : data?.message) ||
      `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}
