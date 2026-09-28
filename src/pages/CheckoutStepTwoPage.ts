import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { logger } from '../utils/logger';

export class CheckoutStepTwoPage extends BasePage {
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async verifyIsOnStepTwo(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async getItemNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getItemSubtotal(): Promise<number> {
    const text = await this.getText(this.subtotalLabel);
    const match = text.match(/Item total: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.getText(this.taxLabel);
    const match = text.match(/Tax: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.getText(this.totalLabel);
    const match = text.match(/Total: \$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async finishCheckout(): Promise<void> {
    await logger.step('Click Finish button to complete order', async () => {
      await this.click(this.finishButton, 'Finish button');
      await expect(this.page).toHaveURL(/checkout-complete\.html/);
    });
  }

  async cancelCheckout(): Promise<void> {
    await logger.step('Cancel checkout overview', async () => {
      await this.click(this.cancelButton, 'Cancel button');
      await expect(this.page).toHaveURL(/inventory\.html/);
    });
  }
}
