import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
async function authRequest(path, options = {}) {
  const response = await fetch(path, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(payload.message || 'Request failed.'); error.fields = payload.errors; error.status = response.status; throw error; }
  return payload;
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [checking, setChecking] = useState(true);
  useEffect(() => { authRequest('/api/auth/me').then(({ user: current }) => setUser(current)).catch(() => setUser(null)).finally(() => setChecking(false)); }, []);
  async function login(credentials) { const result = await authRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); setUser(result.user); return result; }
  async function signup(details) { return authRequest('/api/auth/signup', { method: 'POST', body: JSON.stringify(details) }); }
  async function logout() { try { await authRequest('/api/auth/logout', { method: 'POST' }); } finally { setUser(null); } }
  const value = useMemo(() => ({ user, checking, login, signup, logout }), [user, checking]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider.'); return value; }