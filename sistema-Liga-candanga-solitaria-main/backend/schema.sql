CREATE TABLE IF NOT EXISTS doacoes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  categoria   TEXT NOT NULL,
  quantidade  INTEGER NOT NULL CHECK (quantidade >= 0),
  origem      TEXT NOT NULL,
  data        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Disponível'
              CHECK (status IN ('Disponível', 'Reservada', 'Entregue'))
);

CREATE TABLE IF NOT EXISTS beneficiarios (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nome           TEXT NOT NULL,
  tipo           TEXT,
  regiao         TEXT,
  contato        TEXT,
  necessidade    TEXT,
  data_cadastro  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entregas (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  doacao_id        INTEGER NOT NULL REFERENCES doacoes(id),
  beneficiario_id  INTEGER NOT NULL REFERENCES beneficiarios(id),
  quantidade       INTEGER NOT NULL CHECK (quantidade > 0),
  data             TEXT NOT NULL,
  responsavel      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS controle (
  chave  TEXT PRIMARY KEY,
  valor  TEXT
);
