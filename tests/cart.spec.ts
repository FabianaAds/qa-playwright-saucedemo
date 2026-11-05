import { expect, test } from '../src/fixtures';
import { products } from '../src/data/products';

test.describe('Carrinho', () => {
  test('produto adicionado aparece no carrinho com o preço correto @smoke', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemByName(products.backpack.name)).toContainText(
      `$${products.backpack.price}`,
    );
  });

  test('carrinho vazio não lista nenhum item', async ({ cartPage }) => {
    await cartPage.goto();

    await expect(cartPage.items).toHaveCount(0);
  });
});
