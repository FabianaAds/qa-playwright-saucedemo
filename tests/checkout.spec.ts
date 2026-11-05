import { expect, test } from '../src/fixtures';
import { invalidCheckoutInfo, validCheckoutInfo } from '../src/data/checkout';
import { products } from '../src/data/products';

const parseMoney = (text: string | null) => Number((text ?? '').match(/\d+\.\d{2}/)?.[0]);

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('compra completa: resumo correto e confirmação do pedido @smoke', async ({
    checkoutPage,
    page,
  }) => {
    await checkoutPage.fillInfo(validCheckoutInfo);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    const esperado = products.backpack.price + products.bikeLight.price;
    const subtotal = parseMoney(await checkoutPage.subtotal.textContent());
    const tax = parseMoney(await checkoutPage.tax.textContent());
    const total = parseMoney(await checkoutPage.total.textContent());

    expect(subtotal).toBeCloseTo(esperado, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  for (const { caso, data, erro } of invalidCheckoutInfo) {
    test(`não avança com dados incompletos: ${caso}`, async ({ checkoutPage, page }) => {
      await checkoutPage.fillInfo(data);

      await expect(checkoutPage.errorMessage).toHaveText(erro);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
