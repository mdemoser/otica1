// ===== DADOS DE EXEMPLO (depois virão do banco, via API) =====
const clientes = [
  { id: 1, nome: 'Vitor Almeida',     telefone: '(11) 912345678', email: 'vitor.almeida@email.com', nascimento: '1990-04-12', cpf: '123.456.789-09', endereco: 'Rua das Flores, 120' },
  { id: 2, nome: 'Vitor Hugo Santos', telefone: '(11) 987654321', email: 'vitorhugo@email.com',     nascimento: '1985-09-30', cpf: '',               endereco: 'Av. Brasil, 455' },
  { id: 3, nome: 'Vitor Souza',       telefone: '(11) 955512345', email: 'vsouza@email.com',        nascimento: '1992-01-18', cpf: '987.654.321-00', endereco: 'Rua do Sol, 88' },
  { id: 4, nome: 'Vitor Pereira',     telefone: '(11) 944433221', email: 'vpereira@email.com',      nascimento: '1978-11-05', cpf: '',               endereco: 'Rua Verde, 17' },
  { id: 5, nome: 'Vitor Lima',        telefone: '(11) 933322110', email: 'vlima@email.com',         nascimento: '2001-06-22', cpf: '111.222.333-96', endereco: 'Travessa Azul, 9' },
  { id: 6, nome: 'Maria Souza',       telefone: '(11) 922211009', email: 'maria@email.com',         nascimento: '1985-03-12', cpf: '123.456.789-10', endereco: 'Rua Central, 300' },
  { id: 7, nome: 'João Pereira',      telefone: '(11) 998866554', email: 'joao@email.com',          nascimento: '1978-11-05', cpf: '',               endereco: 'Av. Paulista, 1000' },
  { id: 8, nome: 'Marina Costa',      telefone: '(11) 911100998', email: 'marina@email.com',        nascimento: '1995-07-27', cpf: '555.666.777-88', endereco: 'Rua Nova, 45' },
];

// [clienteId, tipo, descrição, data, valor, encerrada, rótulo]
const historico = [
  [1, 'Venda',   'Armação acetato preta + lentes multifocais com antirreflexo e filtro de luz azul', '2026-08-20', 1280.00, false, 'Em pagamento (3/6)'],
  [1, 'Serviço', 'Ajuste de hastes',                 '2026-05-02', 25.00,   true,  'Compra encerrada'],
  [1, 'Venda',   'Lentes de contato mensais (caixa)', '2026-03-10', 140.00,  true,  'Compra encerrada'],
  [1, 'Serviço', 'Troca de plaquetas',               '2026-01-15', 30.00,   true,  'Compra encerrada'],
  [1, 'Venda',   'Óculos de sol polarizado',         '2025-11-22', 420.00,  true,  'Compra encerrada'],
  [1, 'Venda',   'Estojo + flanela',                 '2025-11-22', 35.00,   true,  'Compra encerrada'],
  [1, 'Serviço', 'Limpeza ultrassônica',             '2025-09-03', 20.00,   true,  'Compra encerrada'],
  [1, 'Venda',   'Armação metálica dourada',         '2025-06-18', 390.00,  true,  'Compra encerrada'],
  [6, 'Venda',   'Armação grafite + lentes simples', '2026-07-08', 560.00,  false, 'Em pagamento (2/4)'],
].map(([clienteId, tipo, descricao, data, valor, encerrada, rotulo]) =>
  ({ clienteId, tipo, descricao, data, valor, encerrada, rotulo }));

// ===== ELEMENTOS =====
const form = document.getElementById('form-cliente');
const campos = {
  nome:       document.getElementById('nome'),
  telefone:   document.getElementById('telefone'),
  email:      document.getElementById('email'),
  nascimento: document.getElementById('nascimento'),
  cpf:        document.getElementById('cpf'),
  endereco:   document.getElementById('endereco'),
};
const elMensagem     = document.getElementById('mensagem');
const tbodyClientes  = document.getElementById('lista-clientes');
const tbodyHistorico = document.getElementById('lista-historico');

let selecionadoId = null;
let listaAtual = clientes;

// ===== UTILITÁRIOS =====
const normalizar = (t) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const digitos = (t) => t.replace(/\D/g, '');
const formatarData = (iso) => iso.split('-').reverse().join('/');
const formatarMoeda = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatarCpf = (d) =>
  d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

function criar(tag, texto, classe) {
  const el = document.createElement(tag);
  if (texto !== undefined) el.textContent = texto;
  if (classe) el.className = classe;
  return el;
}

function linhaVazia(mensagem) {
  const tr = document.createElement('tr');
  const td = criar('td', mensagem, 'vazio');
  td.colSpan = 5;
  tr.appendChild(td);
  return tr;
}

function mostrarMensagem(texto, tipo) {
  elMensagem.textContent = texto;
  elMensagem.className = texto ? 'mensagem ' + tipo : 'mensagem';
}

// ===== CAMADA DE DADOS =====
// Hoje mexe na lista em memória. Quando o backend existir, só estas
// funções mudam (viram chamadas ao servidor); o resto do arquivo fica igual.

function gravarNovoCliente(dados) {
  // futuro: POST /clientes  →  INSERT ... RETURNING id
  const id = Math.max(0, ...clientes.map((c) => c.id)) + 1;
  const novo = { id, ...dados };
  clientes.push(novo);
  return novo;
}

function gravarAtualizacao(id, dados) {
  // futuro: PUT /clientes/<id>  →  UPDATE clientes SET ... WHERE id = ?
  const cliente = clientes.find((c) => c.id === id);
  Object.assign(cliente, dados); // altera o mesmo objeto, então a lista na tela acompanha
  return cliente;
}

// celular, e-mail e CPF não podem repetir entre clientes diferentes
function buscarDuplicado(dados, idIgnorar) {
  for (const c of clientes) {
    if (c.id === idIgnorar) continue;
    if (digitos(c.telefone) === digitos(dados.telefone)) return { campo: 'telefone', cliente: c };
    if (dados.email && c.email === dados.email)           return { campo: 'e-mail',   cliente: c };
    if (dados.cpf && digitos(c.cpf) === digitos(dados.cpf)) return { campo: 'CPF',    cliente: c };
  }
  return null;
}

// ===== FORMULÁRIO =====
function lerFormulario() {
  const cpf = digitos(campos.cpf.value);
  return {
    nome:       campos.nome.value.trim(),
    telefone:   campos.telefone.value.trim(),
    email:      campos.email.value.trim().toLowerCase(),
    nascimento: campos.nascimento.value,
    cpf:        cpf ? formatarCpf(cpf) : '',
    endereco:   campos.endereco.value.trim(),
  };
}

function preencherFormulario(cliente) {
  Object.keys(campos).forEach((k) => { campos[k].value = cliente[k]; });
}

// ===== FILTRO: cada campo preenchido restringe a lista =====
function filtrar() {
  const f = {
    nome:       normalizar(campos.nome.value),
    telefone:   digitos(campos.telefone.value),
    email:      normalizar(campos.email.value),
    nascimento: campos.nascimento.value,
    cpf:        digitos(campos.cpf.value),
    endereco:   normalizar(campos.endereco.value),
  };

  return clientes.filter((c) =>
    normalizar(c.nome).startsWith(f.nome) &&
    digitos(c.telefone).startsWith(f.telefone) &&
    normalizar(c.email).startsWith(f.email) &&
    (!f.nascimento || c.nascimento === f.nascimento) &&
    digitos(c.cpf).startsWith(f.cpf) &&
    normalizar(c.endereco).includes(f.endereco)
  );
}

// ===== RENDERIZAÇÃO =====
function renderClientes(lista) {
  listaAtual = lista;
  tbodyClientes.replaceChildren();

  if (lista.length === 0) {
    tbodyClientes.appendChild(linhaVazia('Nenhum cliente encontrado. Preencha o cadastro e salve para registrar um novo.'));
    return;
  }

  lista.forEach((c) => {
    const tr = document.createElement('tr');
    tr.dataset.id = c.id;
    tr.tabIndex = 0;
    if (c.id === selecionadoId) tr.classList.add('selecionada');

    [c.nome, c.telefone, c.email || '-', formatarData(c.nascimento) || '-', c.cpf || '-']
      .forEach((valor) => tr.appendChild(criar('td', valor)));

    tbodyClientes.appendChild(tr);
  });
}

function renderHistorico(clienteId) {
  tbodyHistorico.replaceChildren();

  if (clienteId === null) {
    tbodyHistorico.appendChild(linhaVazia('Selecione um cliente na lista para ver o histórico.'));
    return;
  }

  const compras = historico
    .filter((h) => h.clienteId === clienteId)
    .sort((a, b) => b.data.localeCompare(a.data)); // mais recentes primeiro

  if (compras.length === 0) {
    tbodyHistorico.appendChild(linhaVazia('Este cliente ainda não tem compras.'));
    return;
  }

  compras.forEach((h) => {
    const tr = document.createElement('tr');

    tr.appendChild(criar('td', h.tipo));

    const tdDesc = document.createElement('td');
    tdDesc.appendChild(criar('div', h.descricao, 'rolagem'));
    tr.appendChild(tdDesc);

    tr.appendChild(criar('td', formatarData(h.data)));
    tr.appendChild(criar('td', formatarMoeda(h.valor), 'valor'));

    const tdSit = document.createElement('td');
    tdSit.appendChild(criar('span', h.rotulo,
      'situacao ' + (h.encerrada ? 'situacao-encerrada' : 'situacao-pagamento')));
    tr.appendChild(tdSit);

    tbodyHistorico.appendChild(tr);
  });
}

// ===== SELEÇÃO =====
function selecionar(id) {
  const cliente = clientes.find((c) => c.id === id);
  selecionadoId = id;

  preencherFormulario(cliente);
  mostrarMensagem('', '');

  renderClientes(listaAtual);   // mantém a lista filtrada, só destaca a escolhida
  renderHistorico(id);
}

function desselecionar() {
  selecionadoId = null;
  Object.values(campos).forEach((input) => { input.value = ''; });
  mostrarMensagem('', '');

  renderClientes(clientes);
  renderHistorico(null);
}

function aoClicarNaLinha(e) {
  const tr = e.target.closest('tr[data-id]');
  if (!tr) return;
  const id = Number(tr.dataset.id);
  if (id === selecionadoId) desselecionar();
  else selecionar(id);
}

function temHistorico(id) {
  return historico.some((h) => h.clienteId === id);
}

function removerCliente(id) {
  // futuro: DELETE /clientes/<id>  →  DELETE FROM clientes WHERE id = ?
  const posicao = clientes.findIndex((c) => c.id === id);
  clientes.splice(posicao, 1);
}

tbodyClientes.addEventListener('click', aoClicarNaLinha);
tbodyClientes.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    aoClicarNaLinha(e);
  }
});

// ===== DIGITAÇÃO NO CADASTRO FILTRA A LISTA =====
Object.values(campos).forEach((input) => {
  input.addEventListener('input', () => {
    if (selecionadoId !== null) return; // com cliente selecionado, os campos são de edição
    mostrarMensagem('', '');
    renderClientes(filtrar());
  });
});

// ===== SALVAR: atualiza o selecionado ou cadastra um novo =====
form.addEventListener('submit', (e) => {
  e.preventDefault(); // o navegador já validou telefone, CPF e obrigatórios

  const dados = lerFormulario();

  const duplicado = buscarDuplicado(dados, selecionadoId);
  if (duplicado) {
    mostrarMensagem(
      `Esse ${duplicado.campo} já está cadastrado para ${duplicado.cliente.nome}. ` +
      'Clique nele na lista para editar o cadastro existente.',
      'erro'
    );
    return;
  }

  if (selecionadoId === null) {
    const novo = gravarNovoCliente(dados);
    renderClientes(clientes);
    selecionar(novo.id);
    mostrarMensagem('Cliente cadastrado.', 'sucesso');
  } else {
    const atualizado = gravarAtualizacao(selecionadoId, dados);
    preencherFormulario(atualizado); // mostra os valores já normalizados
    renderClientes(listaAtual);
    mostrarMensagem('Dados atualizados.', 'sucesso');
  }
});


// ===== LIMPAR: zera o cadastro e as listas para uma nova busca =====
document.getElementById('btn-limpar').addEventListener('click', () => {
  desselecionar();        // esvazia os campos, tira a seleção e volta as listas ao estado inicial
  campos.nome.focus();    // já deixa o cursor pronto para digitar o novo filtro
});

// ===== DELETAR: remove o cliente selecionado =====
document.getElementById('btn-deletar').addEventListener('click', () => {
  if (selecionadoId === null) {
    mostrarMensagem('Selecione um cliente na lista para deletar.', 'erro');
    return;
  }

  const cliente = clientes.find((c) => c.id === selecionadoId);

  if (temHistorico(cliente.id)) {
    mostrarMensagem(
      `${cliente.nome} tem compras no histórico e não pode ser deletado.`,
      'erro'
    );
    return;
  }

  if (!confirm(`Deletar o cadastro de ${cliente.nome}? Essa ação não pode ser desfeita.`)) {
    return;
  }

  removerCliente(cliente.id);
  desselecionar();                         // limpa o formulário e volta as listas ao início
  mostrarMensagem('Cliente deletado.', 'sucesso');
});


// ===== INÍCIO =====
renderClientes(clientes);
renderHistorico(null);