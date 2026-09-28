import { Locator, Page } from '@playwright/test';

export class FooterComponent {
  readonly page: Page;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.twitterLink = page.locator('[data-test="social-twitter"]');
    this.facebookLink = page.locator('[data-test="social-facebook"]');
    this.linkedinLink = page.locator('[data-test="social-linkedin"]');
    this.copyrightText = page.locator('[data-test="footer-copy"]');
  }

  async getCopyrightNotice(): Promise<string> {
    return (await this.copyrightText.innerText()).trim();
  }
}
