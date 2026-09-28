import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { logger } from '../utils/logger';

export class CheckoutCompletePage extends BasePage {
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
  }

  async verifyIsOnCompletePage(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.ponyExpressImage).toBeVisible();
  }

  async getCompletionHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  async getCompletionDescription(): Promise<string> {
    return await this.getText(this.completeText);
  }

  async backToHome(): Promise<void> {
    await logger.step('Click Back Home button', async () => {
      await this.click(this.backHomeButton, 'Back Home button');
      await expect(this.page).toHaveURL(/inventory\.html/);
    });
  }
}
