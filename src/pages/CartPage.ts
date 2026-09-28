import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { FooterComponent } from './components/FooterComponent';
import { logger } from '../utils/logger';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async verifyIsOnCartPage(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<number[]> {
    const rawPrices = await this.cartItemPrices.allTextContents();
    return rawPrices.map((p) => parseFloat(p.replace('$', '').trim()));
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
  }

  async removeItem(productName: string): Promise<void> {
    await logger.step(`Remove '${productName}' from cart`, async () => {
      const slug = this.toSlug(productName);
      const removeBtn = this.page.locator(`[data-test="remove-${slug}"]`);
      await this.click(removeBtn, `Remove button for ${productName}`);
    });
  }

  async continueShopping(): Promise<void> {
    await logger.step('Click Continue Shopping', async () => {
      await this.click(this.continueShoppingButton, 'Continue Shopping button');
      await expect(this.page).toHaveURL(/inventory\.html/);
    });
  }

  async proceedToCheckout(): Promise<void> {
    await logger.step('Proceed to Checkout', async () => {
      await this.click(this.checkoutButton, 'Checkout button');
      await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    });
  }
}
