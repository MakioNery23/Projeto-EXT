Liga Candanga Solidária

Sistema de controle de doações e beneficiários da Liga Candanga de Futsal do DF, desenvolvido para o projeto de extensão universitária (UCB) com a Liga Candanga como parceira, dentro do programa "Liga Candanga Solidária", Referente a ODS 10 — Redução das Desigualdades.

O projeto é dividido em duas partes, ambas em JavaScript:

- backend — API REST em Node.js + Express. Guarda os dados e aplica todas as regras de negócio.
- frontend — interface em React (Vite + Tailwind CSS). Mostra as telas e conversa com a API via fetch.

Estrutura

backend/
  server.js            Cria o app Express, registra as rotas e sobe o servidor
  banco.js             Abre o banco SQLite, cria as tabelas e carrega o exemplo no 1º acesso
  schema.sql           CREATE TABLE das tabelas doacoes, beneficiarios e entregas
  seed.js              Dados de exemplo usados no primeiro acesso
  util.js              gerarId e hojeLocal
  rotas/
    doacoes.js         CRUD de doações + regras
    beneficiarios.js   CRUD de beneficiários + regras
    entregas.js        CRUD de entregas + regras (muda o status da doação)
    resumo.js          Números do dashboard
    sistema.js         Restaurar exemplo / apagar tudo
frontend/
  src/
    components/        Layout, Modal, StatCard, StatusBadge, Field
    lib/
      DataContext.jsx  Única camada que fala com a API (fetch)
      constantes.js    Categorias, status, tipos e regiões
      datas.js         Data de hoje no fuso local
    pages/
      Dashboard.jsx, Doacoes.jsx, Beneficiarios.jsx, Entregas.jsx
      configuracoes/   Área do administrador (editar/remover)

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/doacoes` | Lista doações |
| POST | `/api/doacoes` | Cadastra doação (nasce `Disponível`) |
| PUT | `/api/doacoes/:id` | Edita doação |
| DELETE | `/api/doacoes/:id` | Remove doação |
| GET | `/api/beneficiarios` | Lista beneficiários |
| POST | `/api/beneficiarios` | Cadastra beneficiário |
| PUT | `/api/beneficiarios/:id` | Edita beneficiário |
| DELETE | `/api/beneficiarios/:id` | Remove beneficiário |
| GET | `/api/entregas` | Lista entregas |
| POST | `/api/entregas` | Registra entrega (doação passa para `Entregue`) |
| PUT | `/api/entregas/:id` | Edita entrega |
| DELETE | `/api/entregas/:id` | Remove entrega (doação volta para `Disponível`) |
| GET | `/api/resumo` | Totais do dashboard |
| POST | `/api/sistema/restaurar-exemplo` | Substitui tudo pelos dados de exemplo |
| POST | `/api/sistema/apagar-tudo` | Apaga todos os dados |

Regras de negócio (aplicadas no backend)

- Doação precisa de origem e de quantidade inteira maior que zero.
- Beneficiário precisa de nome.
- Só uma doação `Disponível` pode ser entregue, e a data da entrega não pode ser anterior ao recebimento da doação.
- Uma doação só fica `Entregue` registrando uma entrega; enquanto tiver entrega, não pode mudar de status nem ter data de recebimento posterior à entrega.
- Não é possível remover doação entregue nem beneficiário com entregas.
- Remover uma entrega devolve a doação para Disponível.

