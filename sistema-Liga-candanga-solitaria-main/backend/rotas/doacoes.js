import { Router } from 'express'
import { db, SQL_DOACOES } from '../banco.js'

const router = Router()

function validarDoacao(doacao) {
  if (!doacao.origem?.trim() || !Number.isInteger(doacao.quantidade) || doacao.quantidade <= 0) {
    return 'Preencha a origem e uma quantidade inteira maior que zero.'
  }
  return null
}

function buscarDoacao(id) {
  return db.prepare(`${SQL_DOACOES} WHERE id = ?`).get(id)
}

function buscarEntregaDaDoacao(doacaoId) {
  return db.prepare('SELECT id, data FROM entregas WHERE doacao_id = ?').get(doacaoId)
}

router.get('/', (req, res) => {
  res.json(db.prepare(`${SQL_DOACOES} ORDER BY id DESC`).all())
})

router.post('/', (req, res) => {
  const erro = validarDoacao(req.body)
  if (erro) return res.status(400).json({ erro })

  const { categoria, quantidade, origem, data } = req.body
  const { lastInsertRowid } = db
    .prepare("INSERT INTO doacoes (categoria, quantidade, origem, data, status) VALUES (?, ?, ?, ?, 'Disponível')")
    .run(categoria, quantidade, origem.trim(), data)
  res.status(201).json(buscarDoacao(lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  if (!buscarDoacao(id)) return res.status(404).json({ erro: 'Doação não encontrada.' })

  const erro = validarDoacao(req.body)
  if (erro) return res.status(400).json({ erro })

  const { categoria, quantidade, origem, data, status } = req.body
  const entrega = buscarEntregaDaDoacao(id)
  if (entrega && status !== 'Entregue') {
    return res.status(400).json({ erro: 'Esta doação já tem uma entrega registrada. Remova a entrega para mudar o status.' })
  }
  if (!entrega && status === 'Entregue') {
    return res.status(400).json({ erro: 'Para marcar como Entregue, registre uma entrega na tela de Entregas.' })
  }
  if (entrega && data > entrega.data) {
    return res.status(400).json({ erro: `A data de recebimento não pode ser posterior à entrega (${entrega.data}).` })
  }

  db.prepare('UPDATE doacoes SET categoria = ?, quantidade = ?, origem = ?, data = ?, status = ? WHERE id = ?').run(
    categoria,
    quantidade,
    origem.trim(),
    data,
    status,
    id,
  )
  res.json(buscarDoacao(id))
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  if (buscarEntregaDaDoacao(id)) {
    return res.status(400).json({ erro: 'Esta doação já foi entregue. Remova a entrega antes de remover a doação.' })
  }

  db.prepare('DELETE FROM doacoes WHERE id = ?').run(id)
  res.status(204).end()
})

export default router
