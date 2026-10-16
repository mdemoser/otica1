const campoData    = document.getElementById('data');
const campoPrazo   = document.getElementById('prazo');
const campoEntrega = document.getElementById('entrega');

// converte um Date para o formato "aaaa-mm-dd" (horário local)
function paraTexto(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// data de entrega = data do serviço + prazo em dias corridos
function calcularEntrega() {
  const prazo = parseInt(campoPrazo.value, 10);

  if (!campoData.value || Number.isNaN(prazo) || prazo < 0) {
    campoEntrega.value = '';
    return;
  }

  const [ano, mes, dia] = campoData.value.split('-').map(Number);
  const entrega = new Date(ano, mes - 1, dia + prazo); // o JS ajusta virada de mês e de ano sozinho
  campoEntrega.value = paraTexto(entrega);
}

campoPrazo.addEventListener('input', calcularEntrega);
campoData.addEventListener('input', calcularEntrega);

// início: data de hoje
campoData.value = paraTexto(new Date());
calcularEntrega();