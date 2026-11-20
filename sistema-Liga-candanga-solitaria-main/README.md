# Liga Candanga Solidaria

Sistema web de controle de doacoes e entregas desenvolvido para a **Liga Candanga de Futsal do DF**, como parte do projeto de extensao universitaria da **Universidade Catolica de Brasilia (UCB)**, dentro do programa **Liga Candanga Solidaria**, referente a ODS 10 — Reducao das Desigualdades.

O sistema permite que a equipe da Liga registre doacoes recebidas, cadastre beneficiarios e controle as entregas realizadas, com dashboard de impacto e painel administrativo.

## Funcionalidades

- **Login com autenticacao** — acesso protegido por email e senha
- **Dashboard** — resumo de impacto com totais de doacoes, beneficiarios e entregas, graficos por categoria e regiao, e tabela das ultimas entregas
- **Doacoes** — cadastro com categoria, quantidade, origem, data e status (Disponivel, Reservada, Entregue)
- **Beneficiarios** — cadastro com nome, tipo, regiao administrativa, contato e necessidade
- **Entregas** — vincula uma doacao a um beneficiario com controle de quantidade (entregas parciais), responsavel e data. A quantidade da doacao diminui automaticamente a cada entrega
- **Configuracoes** — area administrativa para restaurar dados de exemplo ou limpar o banco

## Tecnologias

| Camada   | Tecnologia                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite 8, Tailwind CSS 4    |
| Backend  | Node.js (>= 22.13), Express 5       |
| Banco    | SQLite (node:sqlite nativo)          |
| Rotas    | React Router 7 (HashRouter)          |
| Auth     | Token em memoria (SHA-256 na senha)  |

## Estrutura do projeto

```
sistema-Liga-candanga-solitaria-main/
├── backend/
│   ├── server.js              Servidor Express, registra rotas
│   ├── banco.js               Conexao SQLite, tabelas, seed, auth
│   ├── schema.sql             CREATE TABLE (doacoes, beneficiarios, entregas, controle)
│   ├── seed.js                Dados de exemplo do primeiro acesso
│   └── rotas/
│       ├── auth.js            Login, logout e verificacao de token
│       ├── doacoes.js         CRUD de doacoes
│       ├── beneficiarios.js   CRUD de beneficiarios
│       ├── entregas.js        CRUD de entregas (com controle de quantidade)
│       ├── resumo.js          Numeros do dashboard
│       └── sistema.js         Restaurar exemplo / apagar tudo
├── frontend/
│   ├── public/
│   │   └── logo-lcf.jpg       Logo da LCF DF
│   ├── src/
│   │   ├── App.jsx            Rotas e providers (Auth + Data)
│   │   ├── components/        Layout, Modal, StatCard, StatusBadge, Field
│   │   ├── lib/
│   │   │   ├── AuthContext.jsx Contexto de autenticacao
│   │   │   ├── DataContext.jsx Contexto de dados (fetch com a API)
│   │   │   ├── constantes.js  Categorias, status, tipos e regioes
│   │   │   └── datas.js       Data de hoje no fuso local
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Doacoes.jsx
│   │       ├── Beneficiarios.jsx
│   │       ├── Entregas.jsx
│   │       └── configuracoes/
│   │           └── Configuracoes.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Como rodar

### Pre-requisitos

- **Node.js 22.13** ou superior

### 1. Instalar dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Build do frontend

```bash
cd frontend
npm run build
```

Isso gera a pasta `frontend/dist/` com os arquivos estaticos.

### 3. Iniciar o servidor

```bash
cd backend
npm start
```

O sistema fica disponivel em **http://localhost:3000**.

### Modo desenvolvimento

Para desenvolver com hot-reload, abra dois terminais:

```bash
# Terminal 1 — backend com watch
cd backend
npm run dev

# Terminal 2 — frontend com Vite
cd frontend
npm run dev
```

O frontend roda em `http://localhost:5173` e faz proxy das chamadas `/api` para o backend na porta 3000.

## Acesso padrao

| Campo | Valor           |
|-------|-----------------|
| Email | admin@liga.com  |
| Senha | liga2026        |

No primeiro acesso, o sistema carrega automaticamente dados de exemplo para demonstracao.

## Regras de negocio

- Doacao precisa de origem e quantidade inteira maior que zero
- Beneficiario precisa de nome
- So uma doacao com status diferente de "Entregue" e com quantidade disponivel pode receber entregas
- A quantidade da doacao diminui conforme as entregas sao registradas (entregas parciais)
- Quando a quantidade chega a zero, o status muda para "Entregue" automaticamente
- Ao remover uma entrega, a quantidade e devolvida a doacao
- A data da entrega nao pode ser anterior ao recebimento da doacao
- Nao e possivel remover doacao entregue nem beneficiario com entregas

## Licenca

Projeto academico desenvolvido para fins de extensao universitaria.
