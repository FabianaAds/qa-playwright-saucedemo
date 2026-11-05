// Credenciais públicas de demonstração do SauceDemo (podem ser sobrescritas via .env).
const password = process.env.USER_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: process.env.STANDARD_USER ?? 'standard_user', password },
  locked: { username: process.env.LOCKED_USER ?? 'locked_out_user', password },
  invalid: { username: 'usuario_inexistente', password: 'senha_errada' },
};
