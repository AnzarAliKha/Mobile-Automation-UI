import { Locator, Page, expect } from '@playwright/test';
import { logger } from '../../utils/logger';

export class HeaderComponent {
  readonly page: Page;
  readonly appLogo: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLogo = page.locator('.app_logo');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  async getCartCount(): Promise<number> {
    if (await this.shoppingCartBadge.isVisible()) {
      const text = await this.shoppingCartBadge.innerText();
      return parseInt(text.trim(), 10) || 0;
    }
    return 0;
  }

  async openCart(): Promise<void> {
    await logger.step('Open shopping cart', async () => {
      await this.shoppingCartLink.click();
    });
  }

  async openMenu(): Promise<void> {
    await logger.step('Open navigation menu', async () => {
      await this.menuButton.click();
      await this.logoutLink.waitFor({ state: 'visible' });
    });
  }

  async logout(): Promise<void> {
    await logger.step('Perform user logout via header menu', async () => {
      await this.openMenu();
      await this.logoutLink.click();
      await expect(this.page).toHaveURL(/\/(index\.html)?$/);
    });
  }

  async resetAppState(): Promise<void> {
    await logger.step('Reset application state', async () => {
      await this.openMenu();
      await this.resetAppStateLink.click();
      await this.closeMenuButton.click();
    });
  }
}
