import { expect, type Locator, type Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly sortSelect: Locator;
  private readonly prices: Locator;
  private readonly names: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.prices = page.getByTestId('inventory-item-price');
    this.names = page.getByTestId('inventory-item-name');
  }

  async goto() {
    await this.page.goto('/inventory.html');
    await expect(this.title).toHaveText('Products');
  }

  private item(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  async addToCart(productName: string) {
    await this.item(productName).getByRole('button', { name: /add to cart/i }).click();
  }

  async removeFromCart(productName: string) {
    await this.item(productName).getByRole('button', { name: /remove/i }).click();
  }

  removeButton(productName: string): Locator {
    return this.item(productName).getByRole('button', { name: /remove/i });
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption(option);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async getNames(): Promise<string[]> {
    return this.names.allTextContents();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
