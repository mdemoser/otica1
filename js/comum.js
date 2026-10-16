// Barra lateral compartilhada: aparece em todas as páginas internas.
// Para adicionar, remover ou renomear um item do menu, mexa só nesta lista.
(function () {
  const itensMenu = [
    { texto: 'Clientes',  arquivo: 'clientes.html' },
    { texto: 'Vendas',    arquivo: 'vendas.html' },
    { texto: 'Serviço',   arquivo: 'servicos.html' },
    { texto: 'Pagamento', arquivo: 'pagamentos.html' },
  ];

  const paginaAtual = window.location.pathname.split('/').pop();

  const aside = document.createElement('aside');
  aside.className = 'menu-lateral';

  const titulo = document.createElement('div');
  titulo.className = 'menu-titulo';
  titulo.textContent = 'ERP-Ozóó';
  aside.appendChild(titulo);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Áreas do sistema');

  itensMenu.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.arquivo;
    a.textContent = item.texto;
    if (item.arquivo === paginaAtual) a.setAttribute('aria-current', 'page');
    nav.appendChild(a);
  });
  aside.appendChild(nav);

  const btnSair = document.createElement('button');
  btnSair.type = 'button';
  btnSair.className = 'menu-sair';
  btnSair.textContent = 'Sair';
  btnSair.addEventListener('click', () => sair()); // sair() vem do protecao.js
  aside.appendChild(btnSair);

  document.body.prepend(aside);
})();
