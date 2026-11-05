import { expect, test } from '../src/fixtures';
import { users } from '../src/data/users';

// Estes testes precisam começar deslogados, então ignoram a sessão salva.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login com credenciais válidas acessa a listagem de produtos @smoke', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('credenciais inválidas exibem mensagem de erro e mantêm o usuário no login', async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('usuário bloqueado não consegue autenticar', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);

    await expect(loginPage.errorMessage).toContainText('this user has been locked out');
  });

  const camposObrigatorios = [
    { caso: 'sem usuário', username: '', password: 'secret_sauce', erro: 'Username is required' },
    { caso: 'sem senha', username: 'standard_user', password: '', erro: 'Password is required' },
  ];

  for (const { caso, username, password, erro } of camposObrigatorios) {
    test(`validação de campo obrigatório: ${caso}`, async ({ loginPage }) => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toContainText(erro);
    });
  }
});
