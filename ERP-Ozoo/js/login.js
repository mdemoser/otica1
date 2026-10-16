// Credenciais de DEMONSTRAÇÃO (qualquer pessoa consegue ler isto no navegador)
const USUARIO_DEMO = 'one2';
const SENHA_DEMO   = '495M';

const form      = document.getElementById('form-login');
const campoUser = document.getElementById('usuario');
const campoSenha = document.getElementById('senha');
const mensagem  = document.getElementById('mensagem-login');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const usuario = campoUser.value.trim();
  const senha   = campoSenha.value;

  if (usuario === USUARIO_DEMO && senha === SENHA_DEMO) {
    sessionStorage.setItem('logado', 'sim');
    window.location.href = 'pages/clientes.html';
  } else {
    mensagem.textContent = 'Login ou senha incorretos.';
    campoSenha.value = '';
    campoSenha.focus();
  }
});

// some com o aviso assim que a pessoa volta a digitar
[campoUser, campoSenha].forEach((c) =>
  c.addEventListener('input', () => { mensagem.textContent = ''; }));