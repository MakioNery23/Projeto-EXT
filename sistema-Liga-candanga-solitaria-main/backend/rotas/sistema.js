import { Router } from 'express'
import { apagarTudo, carregarExemplo } from '../banco.js'

const router = Router()

router.post('/restaurar-exemplo', (req, res) => {
  carregarExemplo()
  res.status(204).end()
})

router.post('/apagar-tudo', (req, res) => {
  apagarTudo()
  res.status(204).end()
})

export default router
