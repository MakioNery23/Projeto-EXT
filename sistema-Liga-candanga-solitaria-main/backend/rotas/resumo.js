import { Router } from 'express'
import { db } from '../banco.js'

const CATEGORIAS_DOACAO = ['Cesta básica', 'Bola', 'Rede', 'Troféu', 'Uniforme']

const router = Router()

function contar(sql, ...parametros) {
  return db.prepare(sql).get(...parametros).total
}

router.get('/', (req, res) => {
  const doacoesPorCategoria = Object.fromEntries(CATEGORIAS_DOACAO.map((categoria) => [categoria, 0]))
  for (const linha of db.prepare('SELECT categoria, COUNT(*) AS total FROM doacoes GROUP BY categoria').all()) {
    if (linha.categoria in doacoesPorCategoria) doacoesPorCategoria[linha.categoria] = linha.total
  }

  const beneficiariosPorRegiao = {}
  for (const linha of db.prepare('SELECT regiao, COUNT(*) AS total FROM beneficiarios GROUP BY regiao').all()) {
    beneficiariosPorRegiao[linha.regiao] = linha.total
  }

  res.json({
    totalDoacoes: contar('SELECT COUNT(*) AS total FROM doacoes'),
    doacoesDisponiveis: contar('SELECT COUNT(*) AS total FROM doacoes WHERE status = ?', 'Disponível'),
    totalBeneficiarios: contar('SELECT COUNT(*) AS total FROM beneficiarios'),
    totalEntregas: contar('SELECT COUNT(*) AS total FROM entregas'),
    doacoesPorCategoria,
    beneficiariosPorRegiao,
  })
})

export default router
