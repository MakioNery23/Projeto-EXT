import { Router } from 'express'
import { db, SQL_BENEFICIARIOS } from '../banco.js'
import { hojeLocal } from '../util.js'

const router = Router()

function buscarBeneficiario(id) {
  return db.prepare(`${SQL_BENEFICIARIOS} WHERE id = ?`).get(id)
}

router.get('/', (req, res) => {
  res.json(db.prepare(`${SQL_BENEFICIARIOS} ORDER BY id DESC`).all())
})

router.post('/', (req, res) => {
  const { nome, tipo, regiao, contato, necessidade } = req.body
  if (!nome?.trim()) return res.status(400).json({ erro: 'O nome é obrigatório.' })

  const { lastInsertRowid } = db
    .prepare('INSERT INTO beneficiarios (nome, tipo, regiao, contato, necessidade, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)')
    .run(nome.trim(), tipo ?? null, regiao ?? null, contato ?? null, necessidade ?? null, hojeLocal())
  res.status(201).json(buscarBeneficiario(lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  if (!buscarBeneficiario(id)) return res.status(404).json({ erro: 'Beneficiário não encontrado.' })

  const { nome, tipo, regiao, contato, necessidade } = req.body
  if (!nome?.trim()) return res.status(400).json({ erro: 'O nome é obrigatório.' })

  db.prepare('UPDATE beneficiarios SET nome = ?, tipo = ?, regiao = ?, contato = ?, necessidade = ? WHERE id = ?').run(
    nome.trim(),
    tipo ?? null,
    regiao ?? null,
    contato ?? null,
    necessidade ?? null,
    id,
  )
  res.json(buscarBeneficiario(id))
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const { quantidade } = db.prepare('SELECT COUNT(*) AS quantidade FROM entregas WHERE beneficiario_id = ?').get(id)
  if (quantidade > 0) {
    return res.status(400).json({ erro: `Este beneficiário tem ${quantidade} entrega(s) registrada(s). Remova as entregas antes.` })
  }

  db.prepare('DELETE FROM beneficiarios WHERE id = ?').run(id)
  res.status(204).end()
})

export default router
