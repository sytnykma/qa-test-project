import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
}
