import { Router } from 'express'
import { db, SQL_ENTREGAS, transacao } from '../banco.js'

const router = Router()

function buscarEntrega(id) {
  return db.prepare(`${SQL_ENTREGAS} WHERE id = ?`).get(id)
}

function buscarDoacao(id) {
  return db.prepare('SELECT id, data, status FROM doacoes WHERE id = ?').get(id)
}

function beneficiarioExiste(id) {
  return Boolean(db.prepare('SELECT 1 FROM beneficiarios WHERE id = ?').get(id))
}

router.get('/', (req, res) => {
  res.json(db.prepare(`${SQL_ENTREGAS} ORDER BY id DESC`).all())
})

router.post('/', (req, res) => {
  const { doacaoId, beneficiarioId, data, responsavel } = req.body
  if (!doacaoId || !beneficiarioId || !responsavel?.trim()) {
    return res.status(400).json({ erro: 'Selecione a doação, o beneficiário e informe o responsável.' })
  }

  const doacao = buscarDoacao(doacaoId)
  if (!doacao || doacao.status !== 'Disponível') {
    return res.status(400).json({ erro: 'Esta doação não está disponível para entrega.' })
  }
  if (!beneficiarioExiste(beneficiarioId)) {
    return res.status(400).json({ erro: 'Beneficiário não encontrado.' })
  }
  if (data < doacao.data) {
    return res.status(400).json({ erro: `A data da entrega não pode ser anterior ao recebimento da doação (${doacao.data}).` })
  }

  const id = transacao(() => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO entregas (doacao_id, beneficiario_id, data, responsavel) VALUES (?, ?, ?, ?)')
      .run(Number(doacaoId), Number(beneficiarioId), data, responsavel.trim())
    db.prepare("UPDATE doacoes SET status = 'Entregue' WHERE id = ?").run(Number(doacaoId))
    return lastInsertRowid
  })
  res.status(201).json(buscarEntrega(id))
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const entrega = buscarEntrega(id)
  if (!entrega) return res.status(404).json({ erro: 'Entrega não encontrada.' })

  const { beneficiarioId, data, responsavel } = req.body
  if (!responsavel?.trim()) return res.status(400).json({ erro: 'Informe o responsável pela entrega.' })
  if (!beneficiarioExiste(beneficiarioId)) return res.status(400).json({ erro: 'Beneficiário não encontrado.' })

  const doacao = buscarDoacao(entrega.doacaoId)
  if (doacao && data < doacao.data) {
    return res.status(400).json({ erro: `A data da entrega não pode ser anterior ao recebimento da doação (${doacao.data}).` })
  }

  db.prepare('UPDATE entregas SET beneficiario_id = ?, data = ?, responsavel = ? WHERE id = ?').run(
    Number(beneficiarioId),
    data,
    responsavel.trim(),
    id,
  )
  res.json(buscarEntrega(id))
})

router.delete('/:id', (req, res) => {
  const entrega = buscarEntrega(req.params.id)
  if (!entrega) return res.status(404).json({ erro: 'Entrega não encontrada.' })

  transacao(() => {
    db.prepare('DELETE FROM entregas WHERE id = ?').run(entrega.id)
    db.prepare("UPDATE doacoes SET status = 'Disponível' WHERE id = ?").run(entrega.doacaoId)
  })
  res.status(204).end()
})

export default router
