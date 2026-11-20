import { Router } from 'express'
import { db, SQL_ENTREGAS, transacao } from '../banco.js'

const router = Router()

function buscarEntrega(id) {
  return db.prepare(`${SQL_ENTREGAS} WHERE id = ?`).get(id)
}

function buscarDoacao(id) {
  return db.prepare('SELECT id, quantidade, data, status FROM doacoes WHERE id = ?').get(id)
}

function beneficiarioExiste(id) {
  return Boolean(db.prepare('SELECT 1 FROM beneficiarios WHERE id = ?').get(id))
}

router.get('/', (req, res) => {
  res.json(db.prepare(`${SQL_ENTREGAS} ORDER BY id DESC`).all())
})

router.post('/', (req, res) => {
  const { doacaoId, beneficiarioId, quantidade, data, responsavel } = req.body
  const qtd = Number(quantidade)

  if (!doacaoId || !beneficiarioId || !responsavel?.trim()) {
    return res.status(400).json({ erro: 'Selecione a doação, o beneficiário e informe o responsável.' })
  }
  if (!Number.isInteger(qtd) || qtd <= 0) {
    return res.status(400).json({ erro: 'Informe uma quantidade válida.' })
  }

  const doacao = buscarDoacao(doacaoId)
  if (!doacao || doacao.status === 'Entregue') {
    return res.status(400).json({ erro: 'Esta doação não está disponível para entrega.' })
  }
  if (qtd > doacao.quantidade) {
    return res.status(400).json({ erro: `Quantidade indisponível. Restam ${doacao.quantidade} un. nesta doação.` })
  }
  if (!beneficiarioExiste(beneficiarioId)) {
    return res.status(400).json({ erro: 'Beneficiário não encontrado.' })
  }
  if (data < doacao.data) {
    return res.status(400).json({ erro: `A data da entrega não pode ser anterior ao recebimento da doação (${doacao.data}).` })
  }

  const novaQuantidade = doacao.quantidade - qtd
  const novoStatus = novaQuantidade === 0 ? 'Entregue' : doacao.status === 'Reservada' ? 'Reservada' : 'Disponível'

  const id = transacao(() => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO entregas (doacao_id, beneficiario_id, quantidade, data, responsavel) VALUES (?, ?, ?, ?, ?)')
      .run(Number(doacaoId), Number(beneficiarioId), qtd, data, responsavel.trim())
    db.prepare('UPDATE doacoes SET quantidade = ?, status = ? WHERE id = ?').run(novaQuantidade, novoStatus, Number(doacaoId))
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
    const doacao = buscarDoacao(entrega.doacaoId)
    if (doacao) {
      const novaQuantidade = doacao.quantidade + entrega.quantidade
      db.prepare("UPDATE doacoes SET quantidade = ?, status = 'Disponível' WHERE id = ?").run(novaQuantidade, entrega.doacaoId)
    }
  })
  res.status(204).end()
})

export default router
