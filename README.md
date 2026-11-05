# Testes E2E com Playwright — SauceDemo

Suíte de testes automatizados com [Playwright](https://playwright.dev) + TypeScript para o
[SauceDemo](https://www.saucedemo.com), um e-commerce público de demonstração.

## Cenários cobertos

| Spec | Cenários | Tipo |
|---|---|---|
| `login.spec.ts` | Login válido; credenciais inválidas; usuário bloqueado; usuário/senha em branco | Positivo + negativos |
| `inventory.spec.ts` | Ordenação por preço e por nome; badge do carrinho ao adicionar/remover | Positivo |
| `cart.spec.ts` | Produto aparece no carrinho com preço correto; carrinho vazio | Positivo |
| `checkout.spec.ts` | Compra completa (subtotal/total conferidos); campos obrigatórios ausentes | Positivo + negativos |

Os testes principais levam a tag `@smoke` (`npm run test:smoke`).

## Pré-requisitos

- Node.js 18+ (recomendado 20)
- npm

## Instalação

```bash
npm install
npx playwright install --with-deps   # baixa os navegadores
cp .env.example .env                  # opcional: só necessário para sobrescrever valores
```

## Execução

```bash
npm test                 # todos os testes (chromium + firefox), em paralelo
npm run test:chromium    # apenas Chromium
npm run test:headed      # com navegador visível
npm run test:ui          # modo UI interativo do Playwright
npm run test:smoke       # apenas cenários @smoke
npx playwright test tests/login.spec.ts   # um arquivo específico
```

### Ambientes

O ambiente é escolhido pela variável `TEST_ENV` (`prod` por padrão, ou `local`).
A URL pode ser sobrescrita com `BASE_URL`:

```bash
TEST_ENV=local npm test
BASE_URL=https://outro-host.exemplo npm test
```

Novos ambientes são adicionados em `src/config/environments.ts`.

## Relatórios e evidências

- **Relatório HTML:** `npm run report` (gerado em `playwright-report/`)
- **JUnit XML:** `reports/junit.xml` (útil para integrações de CI)
- **Evidências de falha** (em `test-results/`): screenshot, vídeo e *trace*.
  Para abrir um trace: `npx playwright show-trace test-results/<pasta>/trace.zip`

## Estrutura

```
├── .github/workflows/playwright.yml   # pipeline de CI (GitHub Actions)
├── playwright.config.ts               # configuração, reporters, projetos, evidências
├── src/
│   ├── config/environments.ts         # ambientes e caminho da sessão salva
│   ├── data/                          # massa de testes (usuários, produtos, checkout)
│   ├── fixtures/index.ts              # injeta os Page Objects nos testes
│   └── pages/                         # Page Objects (Login, Inventory, Cart, Checkout)
└── tests/
    ├── auth.setup.ts                  # login único; salva a sessão
    └── *.spec.ts                      # cenários de teste
```

## Decisões de projeto

- **Localizadores:** priorizam o que o usuário vê (`getByRole`, `getByPlaceholder`) e, quando
  não há papel/rótulo adequado, `getByTestId` (configurado para o atributo `data-test` do site).
  Nenhum seletor CSS/XPath frágil.
- **Page Object + fixtures:** a lógica de interação fica em `src/pages`; os testes só descrevem
  comportamento e *assertions*.
- **Sessão reaproveitada:** o projeto `setup` faz login uma vez e salva o `storageState`; os
  testes que não exigem login inicial começam já autenticados. O `login.spec.ts` desativa essa
  sessão para testar o login de fato.
- **Independência e paralelismo:** cada teste roda em contexto isolado (carrinho vazio) e a
  execução é `fullyParallel`, sem dependência de ordem entre testes.
- **Massa de testes:** centralizada em `src/data`, com cenários negativos orientados a dados
  (um `for` gera um teste por linha de massa). Credenciais podem vir do `.env`.
- **Sem API de apoio:** o SauceDemo não expõe API pública para preparar dados; por isso o
  login via `storageState` cumpre o papel de reduzir passos repetidos.

## CI/CD

O workflow em `.github/workflows/playwright.yml` roda em *push*, *pull request* e manualmente:
instala dependências, valida tipos, executa os testes e publica o relatório HTML, os
*traces* e o JUnit como artefatos.
