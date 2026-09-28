import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessageContainer: Locator;
  readonly errorMessageText: Locator;
  readonly errorCloseButton: Locator;
  readonly loginCredentialsBox: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageContainer = page.locator('[data-test="error"]');
    this.errorMessageText = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
    this.loginCredentialsBox = page.locator('#login_credentials');
  }

  /**
   * Navigate to Login page
   */
  async navigate(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageReady();
  }

  /**
   * Perform login action with given credentials
   */
  async login(username?: string, password?: string): Promise<void> {
    await logger.step(`Login with username: '${username ?? ''}'`, async () => {
      if (username !== undefined && username !== '') {
        await this.fill(this.usernameInput, username, 'username input');
      } else {
        await this.usernameInput.clear();
      }

      if (password !== undefined && password !== '') {
        await this.fill(this.passwordInput, password, 'password input');
      } else {
        await this.passwordInput.clear();
      }

      await this.click(this.loginButton, 'login button');
    });
  }

  /**
   * Retrieve error message if displayed
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessageText.waitFor({ state: 'visible' });
    return await this.getText(this.errorMessageText);
  }

  /**
   * Check if error banner is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessageText.isVisible();
  }

  /**
   * Dismiss the error message via close button
   */
  async closeErrorMessage(): Promise<void> {
    await this.click(this.errorCloseButton, 'close error button');
  }

  /**
   * Verify on login page
   */
  async verifyIsOnLoginPage(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }
}
