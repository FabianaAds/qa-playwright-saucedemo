export const AUTH_FILE = 'playwright/.auth/standard-user.json';

type Environment = { name: string; baseURL: string };

const environments: Record<string, Environment> = {
  prod: { name: 'prod', baseURL: 'https://www.saucedemo.com' },
  local: { name: 'local', baseURL: 'http://localhost:3000' },
};

/** Resolve o ambiente via TEST_ENV; BASE_URL tem precedência quando definida. */
export function getEnvironment(): Environment {
  const key = process.env.TEST_ENV ?? 'prod';
  const env = environments[key];
  if (!env) {
    throw new Error(
      `TEST_ENV inválido: "${key}". Opções: ${Object.keys(environments).join(', ')}`,
    );
  }
  return { ...env, baseURL: process.env.BASE_URL ?? env.baseURL };
}
