import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to baseURL
   */
  async navigateTo(path: string = ''): Promise<void> {
    await logger.step(`Navigate to URL path: '${path}'`, async () => {
      try {
        await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 25000 });
      } catch (error) {
        logger.warn(`Navigation to '${path}' encountered delay. Retrying with full page load...`);
        await this.page.goto(path, { waitUntil: 'load', timeout: 35000 });
      }
    });
  }

  /**
   * Wait for network idle or dom load
   */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Safely click on a locator with auto-scroll and visibility check
   */
  async click(locator: Locator, description?: string): Promise<void> {
    const desc = description || 'element';
    await logger.step(`Click ${desc}`, async () => {
      await locator.waitFor({ state: 'visible' });
      await locator.click();
    });
  }

  /**
   * Safely fill an input element with text
   */
  async fill(locator: Locator, value: string, description?: string): Promise<void> {
    const desc = description || 'input';
    await logger.step(`Fill ${desc} with value`, async () => {
      await locator.waitFor({ state: 'visible' });
      await locator.fill(value);
    });
  }

  /**
   * Get trimmed text from an element
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.innerText()).trim();
  }

  /**
   * Assert page URL contains expected substring or regex
   */
  async verifyUrlContains(substring: string): Promise<void> {
    await logger.step(`Verify URL contains '${substring}'`, async () => {
      await expect(this.page).toHaveURL(new RegExp(substring));
    });
  }

  /**
   * Capture a full-page screenshot
   */
  async captureScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}
