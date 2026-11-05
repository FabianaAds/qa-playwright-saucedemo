import { expect, test as setup } from '../src/fixtures';
import { AUTH_FILE } from '../src/config/environments';
import { users } from '../src/data/users';

// Autentica uma única vez e persiste a sessão para os demais testes.
setup('autenticar usuário padrão', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: AUTH_FILE });
});
