import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { FooterComponent } from './components/FooterComponent';
import { logger } from '../utils/logger';

export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly activeOption: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.activeOption = page.locator('[data-test="active-option"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /**
   * Ensure page is loaded and title is visible
   */
  async verifyIsOnInventoryPage(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  /**
   * Sort products by option:
   * 'az' (Name A to Z), 'za' (Name Z to A), 'lohi' (Price Low to High), 'hilo' (Price High to Low)
   */
  async sortBy(optionValue: string): Promise<void> {
    await logger.step(`Select sort option: '${optionValue}'`, async () => {
      await this.sortDropdown.selectOption(optionValue);
    });
  }

  /**
   * Get all product names currently displayed on the page
   */
  async getAllProductNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  /**
   * Get all product prices currently displayed on the page as numbers
   */
  async getAllProductPrices(): Promise<number[]> {
    const rawPrices = await this.itemPrices.allTextContents();
    return rawPrices.map((p) => parseFloat(p.replace('$', '').trim()));
  }

  /**
   * Format product name to data-test slug, e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack"
   */
  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Add a product to the cart by its name
   */
  async addProductToCart(productName: string): Promise<void> {
    await logger.step(`Add product to cart: '${productName}'`, async () => {
      const slug = this.toSlug(productName);
      const addButton = this.page.locator(`[data-test="add-to-cart-${slug}"]`);
      await this.click(addButton, `add to cart for '${productName}'`);
    });
  }

  /**
   * Remove a product from the cart by its name
   */
  async removeProductFromCart(productName: string): Promise<void> {
    await logger.step(`Remove product from cart: '${productName}'`, async () => {
      const slug = this.toSlug(productName);
      const removeButton = this.page.locator(`[data-test="remove-${slug}"]`);
      await this.click(removeButton, `remove button for '${productName}'`);
    });
  }

  /**
   * Check if the product has the 'Remove' button visible (indicating it is in cart)
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const slug = this.toSlug(productName);
    const removeButton = this.page.locator(`[data-test="remove-${slug}"]`);
    return await removeButton.isVisible();
  }

  /**
   * Click on product title to navigate to detail view
   */
  async openProductDetails(productName: string): Promise<void> {
    await logger.step(`Open details for product: '${productName}'`, async () => {
      const titleLink = this.page.locator('[data-test="inventory-item-name"]', { hasText: productName });
      await this.click(titleLink, `product title '${productName}'`);
    });
  }
}
