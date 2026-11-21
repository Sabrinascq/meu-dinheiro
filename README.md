# MeuDinheiro

Aplicação web simples de controle financeiro pessoal, desenvolvida como projeto da disciplina **Gerência de Configuração e Manutenção de Software**.

## Objetivo

Permitir o registro de receitas e despesas e apresentar o total de entradas, o total de saídas e o saldo financeiro.

## Escopo definido pela equipe

- Cadastro de receitas com descrição e valor.
- Cadastro de despesas com descrição e valor.
- Cálculo de receitas, despesas e saldo.
- Histórico de movimentações.
- Persistência dos registros no `localStorage` do navegador.

**Fora do escopo:** login, backend, banco de dados, categorias, filtros, edição e exclusão de lançamentos. Os dados ficam armazenados somente no navegador utilizado.

## Tecnologias

- HTML, CSS e JavaScript: interface e funcionalidades.
- Node.js com `node:test`: execução dos testes automatizados.
- `localStorage`: armazenamento local dos lançamentos.
- Git e GitHub: versionamento e colaboração.
- GitHub Actions: automação de testes e publicação.
- GitHub Pages: hospedagem da aplicação.

## Como executar

Não há dependências externas nem etapa de instalação nesta versão inicial.

1. Baixe ou clone o repositório.
2. Abra o arquivo `src/index.html` em um navegador.

Opcionalmente, para executar por um servidor local com Python:

```bash
python -m http.server 8000 --directory src
```

Depois, acesse `http://localhost:8000`.

## Organização inicial

```text
meu-dinheiro/
├── src/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       └── finance.js
├── tests/
│   └── .gitkeep
├── .github/
│   └── workflows/
│       └── .gitkeep
├── docs/
│   └── evidencias/
│       └── .gitkeep
├── package.json
├── .gitignore
└── README.md
```

## Responsabilidades da equipe

| Integrante | Responsabilidade |
|---|---|
| Mariana | Repositório, estrutura inicial, README, integração e relatório técnico |
| Maurício | Estrutura dos lançamentos, cadastro de receitas e despesas, cálculo e validações financeiras |
| Thiago | Interface HTML/CSS e interação com as funções financeiras |
| Sabrina | Testes automatizados com `node:test` e evidências de qualidade |
| Letícia | Workflow do GitHub Actions, CI/CD e publicação no GitHub Pages |

Cada integrante deverá trabalhar em sua própria branch, realizar commits claros e abrir um pull request para integração, conforme a organização definida pelo grupo.

## Testes, pipeline e publicação

Os testes automatizados, o workflow de CI/CD e a publicação serão implementados pelos integrantes responsáveis por essas atividades. As instruções específicas serão adicionadas a este README conforme essas etapas forem concluídas.

## Aplicação publicada

_Ainda não publicada. O link será inserido após a configuração do GitHub Pages._

## Integrantes

- Mariana
- Maurício
- Thiago
- Sabrina
- Letícia

## Limitações previstas

- Os dados ficam somente no `localStorage` do navegador utilizado.
- Não há sincronização entre dispositivos.
- Não há integração com bancos ou serviços financeiros.
- A aplicação tem finalidade acadêmica e de organização financeira básica.
