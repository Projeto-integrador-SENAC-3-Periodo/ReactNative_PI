// ============================================================
//  authService.js — chamadas relacionadas a autenticação
// ============================================================

import { apiRequest } from './api';

/**
 * Autentica o aluno com email/matrícula + senha.
 * POST /auth/login
 * @returns {import('../types').LoginResponseDTO}
 */
export async function login(identificador, senha) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identificador, senha }),
  });
}

/**
 * Altera a senha do usuário autenticado.
 * PUT /auth/alterar-senha
 */
export async function alterarSenha(token, senhaAtual, novaSenha, confirmacaoNovaSenha) {
  return apiRequest(
    '/auth/alterar-senha',
    {
      method: 'PUT',
      body: JSON.stringify({ senhaAtual, novaSenha, confirmacaoNovaSenha }),
    },
    token
  );
}

/**
 * Valida se o token JWT ainda é válido.
 * GET /auth/validate
 */
export async function validateToken(token) {
  return apiRequest('/auth/validate', { method: 'GET' }, token);
}

// ──────────────────────────────────────────────────────────────
//  NOTA: "Esqueceu a senha"
//
//  O back-end atual NÃO possui um endpoint de recuperação de senha
//  por link/token (ex: POST /auth/esqueceu-senha).
//
//  O fluxo existente é:
//    1. Admin cadastra o aluno → sistema gera senha provisória e
//       a envia por email automaticamente (EmailService).
//    2. Aluno acessa com a senha provisória → troca pela definitiva
//       via PUT /auth/alterar-senha.
//
//  Por isso, a tela "Esqueceu Senha" foi adaptada para orientar
//  o aluno a verificar o email cadastrado pelo administrador
//  (sem chamada de API), já que esse é o fluxo real do sistema.
// ──────────────────────────────────────────────────────────────

/**
 * Solicita recuperação de senha.
 * O backend gera uma nova senha provisória e envia por email.
 * POST /auth/recuperar-senha  — sem autenticação.
 * A resposta é sempre genérica (não revela se o usuário existe).
 */
export async function recuperarSenha(identificador) {
  return apiRequest('/auth/recuperar-senha', {
    method: 'POST',
    body: JSON.stringify({ identificador }),
  });
}
