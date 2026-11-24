/**
 * Regras financeiras do MeuDinheiro.
 *
 * Este módulo não depende do HTML nem do DOM. A interface pode chamar estas
 * funções e atualizar a tela com os dados retornados.
 *
 * Tipos de lançamento usados pelo projeto:
 *   - "income": receita
 *   - "expense": despesa
 *
 * Estrutura de cada lançamento:
 *   { id, type, description, amount }
 */

let fallbackIdCounter = 0;

/** Gera um identificador único para cada lançamento. */
function generateId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  fallbackIdCounter += 1;
  return `transaction-${Date.now()}-${fallbackIdCounter}`;
}

/**
 * Converte o valor informado em número.
 * Aceita número ou texto numérico; também aceita vírgula como separador
 * decimal (por exemplo, "125,50"). Não aceita separador de milhar.
 */
function normalizeAmount(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || value.trim() === "") return NaN;

  return Number(value.trim().replace(",", "."));
}

/** Valida e devolve a descrição sem espaços excedentes. */
export function validateDescription(description) {
  if (typeof description !== "string" || description.trim() === "") {
    throw new Error("Informe uma descrição para o lançamento.");
  }

  return description.trim();
}

/** Valida o valor e devolve um número positivo. */
export function validateAmount(amount) {
  const normalizedAmount = normalizeAmount(amount);

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error("O valor deve ser um número maior que zero.");
  }

  return normalizedAmount;
}

/** Cria um lançamento validado, sem alterar qualquer lista existente. */
export function createTransaction(type, description, amount) {
  if (type !== "income" && type !== "expense") {
    throw new Error('O tipo deve ser "income" (receita) ou "expense" (despesa).');
  }

  return {
    id: generateId(),
    type,
    description: validateDescription(description),
    amount: validateAmount(amount),
  };
}

/** Adiciona uma receita e retorna uma nova lista de lançamentos. */
export function registerIncome(transactions, description, amount) {
  ensureTransactionList(transactions);
  const transaction = createTransaction("income", description, amount);
  return [...transactions, transaction];
}

/** Adiciona uma despesa e retorna uma nova lista de lançamentos. */
export function registerExpense(transactions, description, amount) {
  ensureTransactionList(transactions);
  const transaction = createTransaction("expense", description, amount);
  return [...transactions, transaction];
}

/** Calcula os totais e o saldo a partir dos lançamentos informados. */
export function calculateSummary(transactions) {
  ensureTransactionList(transactions);

  const summary = transactions.reduce(
    (totals, transaction) => {
      if (transaction?.type === "income") {
        totals.totalIncome += validateAmount(transaction.amount);
      } else if (transaction?.type === "expense") {
        totals.totalExpenses += validateAmount(transaction.amount);
      } else {
        throw new Error("A lista contém um lançamento com tipo inválido.");
      }

      return totals;
    },
    { totalIncome: 0, totalExpenses: 0 },
  );

  // Arredonda para duas casas decimais para evitar resíduos comuns de ponto
  // flutuante em operações monetárias simples.
  summary.totalIncome = roundCurrency(summary.totalIncome);
  summary.totalExpenses = roundCurrency(summary.totalExpenses);
  summary.balance = roundCurrency(summary.totalIncome + summary.totalExpenses);
  summary.transactionCount = transactions.length;

  return summary;
}

/** Garante que as funções recebam uma lista válida. */
function ensureTransactionList(transactions) {
  if (!Array.isArray(transactions)) {
    throw new Error("Os lançamentos devem ser informados em uma lista.");
  }
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
