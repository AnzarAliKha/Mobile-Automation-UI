import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { logger } from '../utils/logger';

export class CheckoutStepOnePage extends BasePage {
  readonly header: HeaderComponent;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
  }

  async verifyIsOnStepOne(): Promise<void> {
    await expect(this.continueButton).toBeVisible();
  }

  async fillInformation(firstName?: string, lastName?: string, postalCode?: string): Promise<void> {
    await logger.step(`Fill checkout customer info: ${firstName || ''} ${lastName || ''}`, async () => {
      if (firstName !== undefined && firstName !== '') {
        await this.fill(this.firstNameInput, firstName, 'First Name');
      } else {
        await this.firstNameInput.clear();
      }

      if (lastName !== undefined && lastName !== '') {
        await this.fill(this.lastNameInput, lastName, 'Last Name');
      } else {
        await this.lastNameInput.clear();
      }

      if (postalCode !== undefined && postalCode !== '') {
        await this.fill(this.postalCodeInput, postalCode, 'Postal Code');
      } else {
        await this.postalCodeInput.clear();
      }
    });
  }

  async continueToStepTwo(): Promise<void> {
    await logger.step('Click Continue to Step Two', async () => {
      await this.click(this.continueButton, 'Continue button');
    });
  }

  async cancelCheckout(): Promise<void> {
    await logger.step('Cancel checkout', async () => {
      await this.click(this.cancelButton, 'Cancel button');
      await expect(this.page).toHaveURL(/cart\.html/);
    });
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.getText(this.errorMessage);
  }

  async closeErrorMessage(): Promise<void> {
    await this.click(this.errorCloseButton, 'Close Error Button');
  }
}
