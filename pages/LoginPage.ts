// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly loginButton: Locator;
  readonly createAccountButton: Locator;
  readonly themeButton: Locator;
  readonly languageSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Improved robust locators
    this.usernameInput = page.getByRole('textbox', { name: /name/i }).or(page.locator('input[type="text"]'));
    this.loginButton = page.getByRole('button', { name: /login|ورود/i });
    this.createAccountButton = page.getByRole('button', { name: /create account|حساب/i });
    this.themeButton = page.getByTestId('btn-theme');
    this.languageSelect = page.getByTestId('select-language');
  }

  async goto() {
    const filePath = path.resolve(__dirname, '../index.html');
    await this.page.goto(pathToFileURL(filePath).href);
  }

  async createAccount(username: string) {
    await this.usernameInput.fill(username);
    await this.createAccountButton.click();
  }

  async switchTheme() {
    await this.themeButton.first().click();
  }

  async setLanguage(lang: string) {
    await this.languageSelect.selectOption(lang);
  }

  async isUserLoggedIn(): Promise<boolean> {
    const logoutBtn = this.page.getByRole('button', { name: /logout|خروج/i });
    return await logoutBtn.isVisible();
  }
}