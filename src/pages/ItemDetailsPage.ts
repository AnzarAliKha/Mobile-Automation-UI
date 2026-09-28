import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { FooterComponent } from './components/FooterComponent';
import { logger } from '../utils/logger';

export class ItemDetailsPage extends BasePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly backToProductsButton: Locator;
  readonly itemName: Locator;
  readonly itemDesc: Locator;
  readonly itemPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemDesc = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
  }

  async getItemDetails(): Promise<{ name: string; description: string; price: number }> {
    const name = (await this.itemName.innerText()).trim();
    const description = (await this.itemDesc.innerText()).trim();
    const priceText = (await this.itemPrice.innerText()).trim();
    const price = parseFloat(priceText.replace('$', ''));
    return { name, description, price };
  }

  async addToCart(): Promise<void> {
    await logger.step('Add product to cart from details page', async () => {
      await this.click(this.addToCartButton, 'Add to cart button');
    });
  }

  async removeFromCart(): Promise<void> {
    await logger.step('Remove product from cart on details page', async () => {
      await this.click(this.removeButton, 'Remove button');
    });
  }

  async backToProducts(): Promise<void> {
    await logger.step('Navigate back to products list', async () => {
      await this.click(this.backToProductsButton, 'Back to products button');
      await expect(this.page).toHaveURL(/inventory\.html/);
    });
  }
}
