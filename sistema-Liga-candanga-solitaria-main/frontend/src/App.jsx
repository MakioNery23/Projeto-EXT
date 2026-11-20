import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { DataProvider } from './lib/DataContext'
import { Beneficiarios } from './pages/Beneficiarios'
import { Configuracoes } from './pages/configuracoes/Configuracoes'
import { Dashboard } from './pages/Dashboard'
import { Doacoes } from './pages/Doacoes'
import { Entregas } from './pages/Entregas'
import { Login } from './pages/Login'

function RotasProtegidas() {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Carregando...</p>
      </div>
    )
  }

  if (!usuario) return <Login />

  return (
    <DataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="doacoes" element={<Doacoes />} />
          <Route path="beneficiarios" element={<Beneficiarios />} />
          <Route path="entregas" element={<Entregas />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </DataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/*" element={<RotasProtegidas />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
