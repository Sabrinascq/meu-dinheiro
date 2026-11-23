import { test } from "node:test";
import assert from "node:assert/strict";

import {
  registerIncome,
  registerExpense,
  calculateSummary,
} from "../src/js/finance.js";

test("cadastro de receita: adiciona uma receita válida à lista", () => {
  const result = registerIncome([], "Salário", 2500);

  assert.equal(result.length, 1);
  assert.equal(result[0].type, "income");
  assert.equal(result[0].description, "Salário");
  assert.equal(result[0].amount, 2500);
  assert.ok(result[0].id, "o lançamento deve ter um id");
});

test("cadastro de receita: não altera a lista original e rejeita valor inválido", () => {
  const original = [];
  const result = registerIncome(original, "Freelance", "125,50");

  assert.equal(original.length, 0, "a lista original não deve ser modificada");
  assert.equal(result[0].amount, 125.5, "vírgula decimal deve ser aceita");

  assert.throws(() => registerIncome([], "Bônus", 0), /maior que zero/);
  assert.throws(() => registerIncome([], "Bônus", -10), /maior que zero/);
  assert.throws(() => registerIncome([], "", 100), /descrição/);
});

test("cadastro de despesa: adiciona uma despesa válida à lista", () => {
  const result = registerExpense([], "Internet", 100);

  assert.equal(result.length, 1);
  assert.equal(result[0].type, "expense");
  assert.equal(result[0].description, "Internet");
  assert.equal(result[0].amount, 100);
  assert.ok(result[0].id, "o lançamento deve ter um id");
});

test("cadastro de despesa: rejeita descrição vazia e valor inválido", () => {
  assert.throws(() => registerExpense([], "   ", 50), /descrição/);
  assert.throws(() => registerExpense([], "Aluguel", "abc"), /maior que zero/);
  assert.throws(() => registerExpense([], "Aluguel", ""), /maior que zero/);
});

test("cálculo do saldo: receitas menos despesas", () => {
  let transactions = [];
  transactions = registerIncome(transactions, "Salário", 2500);
  transactions = registerExpense(transactions, "Internet", 100);

  const summary = calculateSummary(transactions);

  assert.deepEqual(summary, {
    totalIncome: 2500,
    totalExpenses: 100,
    balance: 2400,
    transactionCount: 2,
  });
});

test("cálculo do saldo: lista vazia resulta em saldo zero", () => {
  const summary = calculateSummary([]);

  assert.equal(summary.totalIncome, 0);
  assert.equal(summary.totalExpenses, 0);
  assert.equal(summary.balance, 0);
  assert.equal(summary.transactionCount, 0);
});

test("cálculo do saldo: saldo negativo e arredondamento de centavos", () => {
  let transactions = [];
  transactions = registerIncome(transactions, "Venda", 0.1);
  transactions = registerIncome(transactions, "Venda 2", 0.2);
  transactions = registerExpense(transactions, "Mercado", 50);

  const summary = calculateSummary(transactions);

  assert.equal(summary.totalIncome, 0.3, "0.1 + 0.2 deve resultar em 0.3");
  assert.equal(summary.balance, -49.7);
});
