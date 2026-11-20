import { createContext, useContext, useEffect, useState } from 'react'
import { API } from './constantes'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCarregando(false)
      return
    }
    fetch(`${API}/auth/verificar`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUsuario(d.usuario))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCarregando(false))
  }, [])

  async function login(email, senha) {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })
    const dados = await r.json()
    if (!r.ok) throw new Error(dados.erro)
    localStorage.setItem('token', dados.token)
    setUsuario(dados.usuario)
  }

  async function logout() {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
