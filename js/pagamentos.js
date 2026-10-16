const el = (id) => document.getElementById(id);

const campoValor    = el('valor');
const campoDesconto = el('desconto');
const campoFrete    = el('frete');
const campoFinal    = el('valor-final');
const chkEntrega    = el('entrega-domicilio');

// ===== HERDA nº de série e ordem de serviço das telas anteriores =====
// (por enquanto vêm na URL; com o banco, virão do SQL)
const params = new URLSearchParams(window.location.search);
el('serie').value = params.get('serie') || '';
el('os').value    = params.get('os') || '';

// ===== UTILITÁRIOS =====
// aceita "1280,50", "1.280,50" e "1280.50"
function paraNumero(texto) {
  let t = texto.trim().replace(/[R$\s]/g, '');
  if (!t) return NaN;

  if (t.includes(',')) {
    t = t.replace(/\./g, '').replace(',', '.');   // 1.280,50 -> 1280.50
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    t = t.replace(/\./g, '');                     // 1.280 -> 1280
  }
  return Number(t);
}

const moeda = (centavos) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ===== VALOR FINAL = cobrança - desconto (%) + frete =====
function calcularFinal() {
  const valor = paraNumero(campoValor.value);

  const textoDesconto = campoDesconto.value.trim();
  const desconto = textoDesconto === '' ? 0 : Number(textoDesconto);

  const textoFrete = campoFrete.value.trim();
  const frete = (campoFrete.disabled || textoFrete === '') ? 0 : paraNumero(textoFrete);

  const invalido =
    Number.isNaN(valor) || valor < 0 ||
    Number.isNaN(desconto) || desconto < 0 || desconto > 100 ||
    Number.isNaN(frete) || frete < 0;

  if (invalido) {
    campoFinal.value = '';
    return;
  }

  // contas em centavos para evitar erro de arredondamento
  const cobranca   = Math.round(valor * 100);
  const abatimento = Math.round(cobranca * desconto / 100);
  const freteCent  = Math.round(frete * 100);

  campoFinal.value = moeda(cobranca - abatimento + freteCent);
}

[campoValor, campoDesconto, campoFrete].forEach((c) =>
  c.addEventListener('input', calcularFinal));

// ===== FRETE só existe com entrega a domicílio =====
function atualizarFrete() {
  campoFrete.disabled = !chkEntrega.checked;
  if (!chkEntrega.checked) campoFrete.value = '';
  calcularFinal();
}
chkEntrega.addEventListener('change', atualizarFrete);

// ===== PARCELAS só com "Parcelado" =====
const radiosModo = document.querySelectorAll('input[name="modo"]');
function atualizarParcelas() {
  el('parcelas').disabled = !el('modo-parcelado').checked;
}
radiosModo.forEach((r) => r.addEventListener('change', atualizarParcelas));

// ===== TIPO DE CARTÃO só com "Cartão" =====
function atualizarCartao() {
  el('tipo-cartao').disabled = !el('forma-cartao').checked;
}
el('forma-cartao').addEventListener('change', atualizarCartao);

// ===== PELO MENOS UMA FORMA DE PAGAMENTO =====
const checksForma = document.querySelectorAll('input[name="forma"]');

function validarForma() {
  const algumaMarcada = [...checksForma].some((c) => c.checked);
  checksForma[0].setCustomValidity(
    algumaMarcada ? '' : 'Escolha pelo menos uma forma de pagamento.'
  );
}
checksForma.forEach((c) => c.addEventListener('change', validarForma));

// ===== INÍCIO =====
atualizarFrete();
atualizarParcelas();
atualizarCartao();
validarForma();