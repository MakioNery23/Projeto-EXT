import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await login(email, senha)
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/logo-lcf.jpg"
            alt="Logo LCF DF"
            className="mb-4 h-28 w-28 rounded-full object-cover shadow-lg"
          />
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Liga Candanga de Futsal
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Liga Candanga Solidária</h1>
          <p className="mt-2 text-sm text-slate-500">Faça login para acessar o sistema</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {erro && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
          )}

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
