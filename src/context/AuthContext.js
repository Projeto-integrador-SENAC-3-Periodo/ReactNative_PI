import React, { createContext, useContext, useState } from 'react';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [cursoAtivo, setCursoAtivo] = useState(null);
  // cursoAtivo shape: { idCurso, nomeCurso }
 
  function signIn(loginResponse) {
    setUser({
      id:              loginResponse.id,
      nome:            loginResponse.nome,
      email:           loginResponse.email,
      matricula:       loginResponse.matricula,
      token:           loginResponse.token,
      perfil:          loginResponse.perfil,
      senhaProvisoria: loginResponse.senhaProvisoria,
    });
    setCursoAtivo(null); // será preenchido após buscar os cursos
  }
 
  function signOut() {
    setUser(null);
    setCursoAtivo(null);
  }
 
  /** Atualiza dados do usuário localmente (após editar perfil) */
  function atualizarUser(campos) {
    setUser((prev) => ({ ...prev, ...campos }));
  }
 
  return (
    <AuthContext.Provider value={{ user, cursoAtivo, setCursoAtivo, signIn, signOut, atualizarUser }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}