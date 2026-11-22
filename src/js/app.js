// ===== Interface e interação (responsável: Thiago) =====
// Liga o formulário, o resumo e o histórico às regras financeiras de
// finance.js (Maurício) e guarda os lançamentos no localStorage.

import { registerIncome, registerExpense, calculateSummary } from "./finance.js";

const STORAGE_KEY = "meudinheiro:transactions";

// --- Elementos da página ---
const form = document.getElementById("form-lancamento");
const campoDescricao = document.getElementById("descricao");
const campoValor = document.getElementById("valor");
const mensagem = document.getElementById("mensagem");
const elReceitas = document.getElementById("total-receitas");
const elDespesas = document.getElementById("total-despesas");
const elSaldo = document.getElementById("saldo");
const listaHistorico = document.getElementById("historico");
const textoVazio = document.getElementById("historico-vazio");

const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const ROTULOS = { income: "Receita", expense: "Despesa" };

// --- Persistência local ---
function lancamentoValido(t) {
  return (
    t &&
    (t.type === "income" || t.type === "expense") &&
    typeof t.description === "string" &&
    Number.isFinite(t.amount) &&
    t.amount > 0
  );
}

function carregarLancamentos() {
  try {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // descarta registros corrompidos para não quebrar o cálculo do resumo
    return Array.isArray(dados) ? dados.filter(lancamentoValido) : [];
  } catch {
    return [];
  }
}

function salvarLancamentos(lista) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    mostrarMensagem("Não foi possível salvar neste navegador.", "erro");
  }
}

let transactions = carregarLancamentos();

// --- Conversão do valor digitado ---
// Aceita o formato brasileiro com milhar ("2.500,00"), vírgula ("10,5")
// ou ponto ("10.50"). Texto inválido vira NaN e é recusado pelo finance.js.
function converterValor(texto) {
  let t = String(texto).trim().replace(/\s|R\$/g, "");
  if (t === "") return NaN;
  if (t.includes(",")) {
    t = t.replace(/\./g, "").replace(",", ".");
  }
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return NaN;
  return Number(t);
}

// --- Renderização ---
function renderizarResumo() {
  const { totalIncome, totalExpenses, balance } = calculateSummary(transactions);
  elReceitas.textContent = formatoMoeda.format(totalIncome);
  elDespesas.textContent = formatoMoeda.format(totalExpenses);
  elSaldo.textContent = formatoMoeda.format(balance);
  elSaldo.classList.toggle("negativo", balance < 0);
}

function renderizarHistorico() {
  listaHistorico.innerHTML = "";
  textoVazio.hidden = transactions.length > 0;

  // mais recentes primeiro
  for (const t of [...transactions].reverse()) {
    const item = document.createElement("li");
    item.className = `item ${t.type}`;

    const info = document.createElement("div");
    info.className = "item-info";

    const descricao = document.createElement("p");
    descricao.className = "item-descricao";
    descricao.textContent = t.description; // textContent evita injeção de HTML
    descricao.title = t.description;

    const tipo = document.createElement("p");
    tipo.className = "item-tipo";
    tipo.textContent = ROTULOS[t.type];

    info.append(descricao, tipo);

    const valor = document.createElement("p");
    valor.className = "item-valor";
    const sinal = t.type === "income" ? "+ " : "− ";
    valor.textContent = sinal + formatoMoeda.format(t.amount);

    item.append(info, valor);
    listaHistorico.append(item);
  }
}

function renderizar() {
  renderizarResumo();
  renderizarHistorico();
}

// --- Mensagens de feedback ---
let temporizadorMensagem;
function mostrarMensagem(texto, tipo) {
  clearTimeout(temporizadorMensagem);
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.hidden = false;
  if (tipo === "sucesso") {
    temporizadorMensagem = setTimeout(() => { mensagem.hidden = true; }, 2500);
  }
}

function limparErros() {
  campoDescricao.removeAttribute("aria-invalid");
  campoValor.removeAttribute("aria-invalid");
}

// --- Envio do formulário ---
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  limparErros();

  const tipo = form.elements.tipo.value;
  const descricao = campoDescricao.value;
  const valor = converterValor(campoValor.value);

  try {
    const registrar = tipo === "income" ? registerIncome : registerExpense;
    // finance.js devolve uma NOVA lista; guardamos o retorno
    transactions = registrar(transactions, descricao, valor);
    salvarLancamentos(transactions);
    renderizar();

    form.reset();
    form.elements.tipo.value = tipo; // mantém o tipo escolhido
    campoDescricao.focus();
    mostrarMensagem(`${ROTULOS[tipo]} adicionada!`, "sucesso");
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
    // destaca o campo provavelmente errado
    const campo = descricao.trim() === "" ? campoDescricao : campoValor;
    campo.setAttribute("aria-invalid", "true");
    campo.focus();
  }
});

// Mantém várias abas do mesmo navegador sincronizadas
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    transactions = carregarLancamentos();
    renderizar();
  }
});

renderizar();
