import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/doacoes', label: 'Doações' },
  { to: '/beneficiarios', label: 'Beneficiários' },
  { to: '/entregas', label: 'Entregas' },
  { to: '/configuracoes', label: 'Configurações' },
]

export function Layout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Liga Candanga de Futsal
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Liga Candanga Solidária</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="-mx-1 flex gap-1 overflow-x-auto whitespace-nowrap px-1">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            {usuario && (
              <button
                onClick={logout}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
