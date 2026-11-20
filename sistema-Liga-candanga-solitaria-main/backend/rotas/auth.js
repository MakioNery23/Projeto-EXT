import crypto from 'node:crypto'
import { Router } from 'express'
import { db, hashSenha } from '../banco.js'

const router = Router()

function gerarToken() {
  return crypto.randomBytes(32).toString('hex')
}

const tokens = new Map()

router.post('/login', (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' })
  }

  const usuario = db.prepare(
    'SELECT id, nome, email, senha, papel FROM usuarios WHERE email = ?'
  ).get(email)

  if (!usuario || usuario.senha !== hashSenha(senha)) {
    return res.status(401).json({ erro: 'Email ou senha incorretos.' })
  }

  const token = gerarToken()
  tokens.set(token, { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel })

  res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
  })
})

router.get('/verificar', (req, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido.' })
  }

  const token = auth.slice(7)
  const usuario = tokens.get(token)
  if (!usuario) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }

  res.json({ usuario })
})

router.post('/logout', (req, res) => {
  const auth = req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) {
    tokens.delete(auth.slice(7))
  }
  res.json({ ok: true })
})

export default router
