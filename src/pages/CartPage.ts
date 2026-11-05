import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  private readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  itemByName(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
