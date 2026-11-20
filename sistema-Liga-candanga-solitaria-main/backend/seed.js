export const SEED_DOACOES = [
  { id: 1, categoria: 'Cesta básica', quantidade: 0, origem: 'Equipe Guará FS', data: '2026-09-05', status: 'Entregue' },
  { id: 2, categoria: 'Cesta básica', quantidade: 25, origem: 'Torcida Ceilândia', data: '2026-09-12', status: 'Disponível' },
  { id: 3, categoria: 'Bola', quantidade: 0, origem: 'Loja Esporte Total', data: '2026-09-08', status: 'Entregue' },
  { id: 4, categoria: 'Uniforme', quantidade: 20, origem: 'Equipe Taguatinga Sub-17', data: '2026-09-15', status: 'Disponível' },
  { id: 5, categoria: 'Rede', quantidade: 6, origem: 'Comércio local - Samambaia', data: '2026-09-18', status: 'Reservada' },
  { id: 6, categoria: 'Troféu', quantidade: 3, origem: 'Liga Candanga (estoque)', data: '2026-09-20', status: 'Disponível' },
]

export const SEED_BENEFICIARIOS = [
  {
    id: 1,
    nome: 'Escolinha de Futsal do Guará (exemplo)',
    tipo: 'Escolinha',
    regiao: 'Guará',
    contato: '(61) 99999-0001',
    necessidade: 'Uniformes e bolas para a categoria sub-11',
    dataCadastro: '2026-09-04',
  },
  {
    id: 2,
    nome: 'Família Silva (exemplo)',
    tipo: 'Família',
    regiao: 'Ceilândia',
    contato: '(61) 99999-0002',
    necessidade: 'Cesta básica mensal',
    dataCadastro: '2026-09-06',
  },
  {
    id: 3,
    nome: 'Associação Comunitária de Samambaia (exemplo)',
    tipo: 'Instituição',
    regiao: 'Samambaia',
    contato: '(61) 99999-0003',
    necessidade: 'Redes de gol e materiais de manutenção da quadra',
    dataCadastro: '2026-09-10',
  },
]

export const SEED_ENTREGAS = [
  { id: 1, doacaoId: 1, beneficiarioId: 2, quantidade: 40, data: '2026-09-07', responsavel: 'Márcio Sodré' },
  { id: 2, doacaoId: 3, beneficiarioId: 1, quantidade: 15, data: '2026-09-09', responsavel: 'Márcio Sodré' },
]
