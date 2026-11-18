import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { SEED_BENEFICIARIOS, SEED_DOACOES, SEED_ENTREGAS } from './seed.js'

const ARQUIVO_BANCO = process.env.DB_FILE || path.join(import.meta.dirname, 'dados.db')
const ARQUIVO_SCHEMA = path.join(import.meta.dirname, 'schema.sql')

export const db = new DatabaseSync(ARQUIVO_BANCO)

db.exec('PRAGMA foreign_keys = ON')
db.exec(fs.readFileSync(ARQUIVO_SCHEMA, 'utf-8'))

export const SQL_DOACOES = 'SELECT id, categoria, quantidade, origem, data, status FROM doacoes'
export const SQL_BENEFICIARIOS =
  'SELECT id, nome, tipo, regiao, contato, necessidade, data_cadastro AS dataCadastro FROM beneficiarios'
export const SQL_ENTREGAS =
  'SELECT id, doacao_id AS doacaoId, beneficiario_id AS beneficiarioId, data, responsavel FROM entregas'

export function transacao(funcao) {
  db.exec('BEGIN')
  try {
    const resultado = funcao()
    db.exec('COMMIT')
    return resultado
  } catch (erro) {
    db.exec('ROLLBACK')
    throw erro
  }
}

function limparTabelas() {
  db.exec('DELETE FROM entregas')
  db.exec('DELETE FROM doacoes')
  db.exec('DELETE FROM beneficiarios')
  db.exec('DELETE FROM sqlite_sequence')
}

export function apagarTudo() {
  transacao(limparTabelas)
}

export function carregarExemplo() {
  transacao(() => {
    limparTabelas()

    const inserirDoacao = db.prepare(
      'INSERT INTO doacoes (id, categoria, quantidade, origem, data, status) VALUES (?, ?, ?, ?, ?, ?)',
    )
    for (const d of SEED_DOACOES) {
      inserirDoacao.run(d.id, d.categoria, d.quantidade, d.origem, d.data, d.status)
    }

    const inserirBeneficiario = db.prepare(
      'INSERT INTO beneficiarios (id, nome, tipo, regiao, contato, necessidade, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    for (const b of SEED_BENEFICIARIOS) {
      inserirBeneficiario.run(b.id, b.nome, b.tipo, b.regiao, b.contato, b.necessidade, b.dataCadastro)
    }

    const inserirEntrega = db.prepare(
      'INSERT INTO entregas (id, doacao_id, beneficiario_id, data, responsavel) VALUES (?, ?, ?, ?, ?)',
    )
    for (const e of SEED_ENTREGAS) {
      inserirEntrega.run(e.id, e.doacaoId, e.beneficiarioId, e.data, e.responsavel)
    }
  })
}

const jaIniciado = db.prepare("SELECT valor FROM controle WHERE chave = 'iniciado'").get()
if (!jaIniciado) {
  carregarExemplo()
  db.prepare("INSERT INTO controle (chave, valor) VALUES ('iniciado', 'sim')").run()
}
