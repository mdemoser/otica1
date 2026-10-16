// Preenche a data com o dia de hoje
const campoData = document.getElementById('data');
const hoje = new Date();

const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, '0');
const dia = String(hoje.getDate()).padStart(2, '0');

campoData.value = `${ano}-${mes}-${dia}`;