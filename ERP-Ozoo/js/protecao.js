// Se não houver login feito, volta para a tela de login
// (todas as páginas protegidas ficam em /pages, então o login está um nível acima)
if (sessionStorage.getItem('logado') !== 'sim') {
  window.location.replace('../index.html');
}

// Usada pelo botão "Sair" da barra lateral
function sair() {
  sessionStorage.removeItem('logado');
  window.location.replace('../index.html');
}
