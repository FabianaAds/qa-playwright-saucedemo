import { expect, test } from '../src/fixtures';
import { products } from '../src/data/products';

test.describe('Listagem de produtos', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('ordena produtos por preço do menor para o maior', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getPrices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('ordena produtos por nome de Z a A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('badge do carrinho acompanha adição e remoção de produtos', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.addToCart(products.bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.bikeLight.name);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
